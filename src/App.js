import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import web3 from './web3';
import lottery from './lottery';

class App extends Component {
  // constructor(props) {
  //   super(props);
  //   this.state = { manager: '' };
  // }

  //es6 will automatically inject this into constructor same as above
  state = {
    manager: '',
    players: [],
    balance: '',
    value: ''
  };

  async componentDidMount() {
    //using metamask provider, don't need to specify 'from' address in call()
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);

    this.setState({ manager, players });
  }

  onSubmit = async e => {
    e.preventDefault();

    const accounts = await web3.eth.getAccounts();
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, 'ether')
    });
  };

  render() {
    web3.eth.getAccounts().then(console.log);
    return (
      <div>
        <h2>Lottery Contract</h2>
        <p>
          This contract is managed by {this.state.manager}. There are currently{' '}
          {this.state.players.length} people entered to win{' '}
          {web3.utils.fromWei(this.state.balance, 'ether')} Ether!
        </p>
        <hr />
        <form onSubmit={this.onSubmit}>
          <h4>Want to enter lottery pool?</h4>
          <div>
            <label>Enter amount of Ether</label>
            <input
              value={this.state.value}
              onChange={event => this.setState({ value: event.target.value })}
            />
          </div>
          <button>Enter</button>
        </form>
      </div>
    );
  }
}

export default App;
