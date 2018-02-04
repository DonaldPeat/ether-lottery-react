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
    value: '',
    message: '',
    winner: ''
  };

  async componentDidMount() {
    //using metamask provider, don't need to specify 'from' address in call()
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);

    this.setState({ manager, players, balance });
  }

  onSubmit = async e => {
    e.preventDefault();
    this.setState({ message: 'Waiting on transaction success...' });

    const accounts = await web3.eth.getAccounts();

    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, 'ether')
    });

    this.setState({ message: 'You have been entered!' });
  };

  onClick = async e => {
    this.setState({ message: 'Randomly selecting a winner...' });

    const accounts = await web3.eth.getAccounts();
    await lottery.methods.pickWinner().send({
      from: accounts[0]
    });
    const winner = await lottery.methods.winner().call();
    this.setState({ winner });
    this.setState({ message: 'The winner is ' + winner + '!' });
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
        <hr />
        <h4>Ready to pick a winner?</h4>
        <button onClick={this.onClick}>Pick a winner!</button>
        <hr />
        <h1>{this.state.message}</h1>
      </div>
    );
  }
}

export default App;
