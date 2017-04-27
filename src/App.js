import React, { Component } from 'react';
import Mousetrap from 'mousetrap';
import Timer from './Timer';

import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    // We use '0' for resets, start indexing from 1
    this.state = {
      timers: [
        1,
      ],
    };

    this.handleAddTimer = this.handleAddTimer.bind(this);

    Mousetrap.bind('+', this.handleAddTimer);
  }

  handleAddTimer() {
    this.setState({
      timers: this.state.timers.concat(this.state.timers.length + 1)
    })
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>Simple timers</h2>
        </div>
        <div className="App-timers">
          {this.state.timers.map(timer => <Timer key={timer} index={timer} />)}
        </div>
        <div className="App-more">
          <button className="App-button" onClick={this.handleAddTimer}>
            Add timer
          </button>
        </div>
      </div>
    );
  }
}

export default App;
