import React, { Component } from 'react';
import Mousetrap from 'mousetrap';
import Timer from './Timer';

import './TimerPage.css';

class TimerPage extends Component {
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
      <div className="TimerPage">
        <div className="TimerPage-header">
          <h2>Simple timers</h2>
          <p>
            {`Use keypad numbers to control the timers, 0 + number to reset.`}
          </p>
        </div>
        <div className="TimerPage-timers">
          {this.state.timers.map(timer => <Timer key={timer} index={timer} />)}
        </div>
        <div className="TimerPage-more">
          <button className="TimerPage-button" onClick={this.handleAddTimer}>
            Add timer
          </button>
        </div>
      </div>
    );
  }
}

export default TimerPage;
