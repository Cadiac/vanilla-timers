import React, { Component } from 'react';
import Mousetrap from 'mousetrap';
import moment from 'moment';
import 'moment-duration-format';

import './Timer.css';

const colors = [
  '#F2C57C',
  '#DDAE7E',
  '#7FB685',
  '#426A5A',
  '#EF6F6C',
  '#846C44',
  '#795F45',
  '#3A533D',
  '#759287',
  '#6D3332',
]

class Timer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      active: false,
      startTime: null,
      previous: moment.duration(),
      elapsed: moment.duration(),
    };

    this.timer = null;

    this.handleStartTimer = this.handleStartTimer.bind(this);
    this.handleStopTimer = this.handleStopTimer.bind(this);
    this.handleResetTimer = this.handleResetTimer.bind(this);

    // Bind '{index}' to start/stop, '0 {index}' to reset
    Mousetrap.bind(`${props.index}`, () => this.state.active ?
      this.handleStopTimer() :
      this.handleStartTimer());
    Mousetrap.bind(`0 ${props.index}`, this.handleResetTimer);
  }

  handleStartTimer() {
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

  handleStopTimer() {
    clearInterval(this.timer);

    // Since interval only runs every 50ms, we need to calculate the
    // actual difference between start and end here for better precision
    const exactDiff = moment.duration(moment().diff(this.state.startTime))
      .add(this.state.previous);

    // Store elapsed time in previous, and update elapsed to exact value
    this.setState({ active: false, previous: exactDiff, elapsed: exactDiff });
  }

  handleResetTimer() {
    this.setState({
      startTime: moment(),
      previous: moment.duration(),
      elapsed: moment.duration(),
    });
  }

  render() {
    return (
      <div className="Timer" style={{backgroundColor: colors[this.props.index % 10]}}>
        <div className="Timer-header">
          <h2>{`${this.props.name} - ${this.props.index}`}</h2>
        </div>
        <p className="Timer-number">
          {this.state.elapsed.format('hh:mm:ss:SSS', { trim: false })}
        </p>
        {this.state.active ?
          <button onClick={this.handleStopTimer}>
            Stop
          </button> :
          <button onClick={this.handleStartTimer}>
            Start
          </button>
        }
        <button onClick={this.handleResetTimer}>
          Reset
        </button>
      </div>
    );
  }
}

export default Timer;
