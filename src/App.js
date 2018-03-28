import React, { Component } from 'react';
import './App.css';
import web3 from "./web3"
import loterry from './loterry'

class App extends Component {
  state = {
    manager: '',
    players: [],
    balance: '',
    value: '',
    message: ''
  }

  async getInfo() {
    const manager = await loterry.methods.manager().call()
    const players = await loterry.methods.getPlayers().call()
    const balance = await web3.eth.getBalance(loterry.options.address)

    this.setState({ manager, players, balance })
  }

  async componentDidMount() {
    await this.getInfo()
  }

  onSubmit = async (event) => {
    event.preventDefault()
    const accounts = await web3.eth.getAccounts()

    this.setState({ message: 'Waiting on transaction success...' })

    await loterry.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, 'ether')
    })

    await this.getInfo()
    this.setState({ message: 'You have been entered!' })
  }

  onClick = async () => {
    const accounts = await web3.eth.getAccounts()

    this.setState({ message: 'Picking up a winner...' })

    await loterry.methods.pickWinner().send({
      from: accounts[0]
    })

    await this.getInfo()
    this.setState({ message: `A winner has been picked` })
  }

  render() {
    return (
      <div>
        <h2>Loterry Contract</h2>
        <p>
          This contract is managed by {this.state.manager},
          There are currently {this.state.players.length} people entered competing to win {web3.utils.fromWei(this.state.balance)} ether!
        </p>
        <hr />
        <form onSubmit={this.onSubmit}>
          <h4>Want to try your luck ?</h4>
          <div>
            <label>Amount of ether to enter</label>
            <input onChange={event => this.setState({ value: event.target.value })} value={this.state.value} />
          </div>
          <button>Enter</button>
        </form>
        <hr />
          <h1>{this.state.message}</h1>
        <hr />
          <h4>Ready to pick a winner?</h4>   
          <button onClick={this.onClick}> Pick a winner! </button>     
        <hr />
      </div>
    );
  }
}

export default App;