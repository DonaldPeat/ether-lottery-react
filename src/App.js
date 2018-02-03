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
    balance: ''
  };

  async componentDidMount() {
    //using metamask provider, don't need to specify 'from' address in call()
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);

    this.setState({ manager, players });
  }

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
      </div>
    );
  }
}

export default App;
