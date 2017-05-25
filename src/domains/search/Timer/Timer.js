import React, { Component } from 'react';
import Mousetrap from 'mousetrap';
import moment from 'moment';
import 'moment-duration-format';

class Timer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      active: false,
      startTime: null,
      previous: moment.duration(),
      elapsed: moment.duration(props.spawntime, 'seconds'),
      spawntime: moment.duration(props.spawntime, 'seconds'),
    };

    this.timer = null;

    this.handleStartAscendingTimer = this.handleStartAscendingTimer.bind(this);
    this.handleStartDescendingTimer = this.handleStartDescendingTimer.bind(this);
    this.handleStopTimer = this.handleStopTimer.bind(this);
    this.handleResetTimer = this.handleResetTimer.bind(this);

    // Bind '{index}' to start/stop, '0 {index}' to reset
    Mousetrap.bind(`${props.index}`, () => this.state.active ?
      this.handleStopTimer() :
      this.handleStartTimer());
    Mousetrap.bind(`0 ${props.index}`, this.handleResetTimer);
  }

  handleStartAscendingTimer() {
    this.setState({ active: true, startTime: moment() });

    if (this.timer) {
      clearInterval(this.timer);
    }

    this.timer = setInterval(() =>
      this.setState({
        elapsed: moment.duration(moment().diff(this.state.startTime))
          // Add previous timer if we already have clocked some time
          .add(this.state.previous),
      })
    , 50);
  }

  handleStartDescendingTimer() {
    this.setState({ active: true, startTime: moment() });

    if (this.timer) {
      clearInterval(this.timer);
    }

    this.timer = setInterval(() => {
      const exactDiff = moment.duration(moment().diff(this.state.startTime))
        .add(this.state.previous);

      const elapsed = moment.duration()
        .add(this.props.spawntime, 's')
        .subtract(exactDiff);

      this.setState({ elapsed });
    }
    , 50);
  }

  handleStopTimer() {
    clearInterval(this.timer);

    // Since interval only runs every 50ms, we need to calculate the
    // actual difference between start and end here for better precision
    const exactDiff = moment.duration(moment().diff(this.state.startTime))
      .add(this.state.previous);

    const elapsed = moment.duration()
      .add(this.props.spawntime, 's')
      .subtract(exactDiff);

    // Store elapsed time in previous, and update elapsed to exact value
    this.setState({ active: false, previous: exactDiff, elapsed });
  }

  handleResetTimer() {
    this.setState({
      startTime: moment(),
      previous: moment.duration(),
      elapsed: moment.duration(this.state.spawntime),
    });
  }

  render() {
    return (
      <div className="card">
        <div className="card-header">
          <div className="popover popover-right">
            <h2 className="card-title">{`${this.props.name} - ${this.props.spawntime}`}</h2>
            <div className="popover-container">
              <div className="card">
                <div className="card-body">
                  Press <kbd>{`${this.props.index}`}</kbd> to start the timer.
                  Combination of <kbd>{`0 + ${this.props.index}`}</kbd> resets the clock.
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="card-body">
          <h2>{this.state.elapsed.format('hh:mm:ss:SSS', { trim: false })}</h2>
        </div>
        <div className="card-footer">
          {this.state.active ?
            <button className="btn btn-primary" onClick={this.handleStopTimer}>
              Stop
            </button> :
            <button className="btn" onClick={this.handleStartDescendingTimer}>
              Start
            </button>
          }
          <button className="btn btn-link" onClick={this.handleResetTimer}>
            Reset
          </button>
        </div>
      </div>
    );
  }
}

export default Timer;
