import React, { Component } from 'react';
import Mousetrap from 'mousetrap';
import ReactGA from 'react-ga';
import moment from 'moment';
import 'moment-duration-format';

import './Timer.css';

class Timer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      active: false,
      startTime: null,
      previous: moment.duration(),
      remaining: moment.duration(props.spawntime, 'seconds'),
      spawntime: moment.duration(props.spawntime, 'seconds'),
      percentage: 100,
    };

    this.timer = null;

    this.handleStartTimer = this.handleStartTimer.bind(this);
    this.handleStopTimer = this.handleStopTimer.bind(this);
    this.handleResetTimer = this.handleResetTimer.bind(this);

    // Bind '{index}' to reset, '0 {index}' to start/stop
    Mousetrap.bind(`${props.index}`, () => this.handleResetTimer());
    Mousetrap.bind(`0 ${props.index}`, () => this.state.active ?
      this.handleStopTimer() :
      this.handleStartTimer());
  }

  handleStartTimer(event) {
    this.setState({ active: true, startTime: moment() });

    if (this.timer) {
      clearInterval(this.timer);
    }

    this.timer = setInterval(() => {
      const exactDiff = moment.duration(moment().diff(this.state.startTime))
        .add(this.state.previous);

      const remaining = moment.duration()
        .add(this.props.spawntime, 's')
        .subtract(exactDiff);

      const percentage = Math.max((remaining.asSeconds() / this.state.spawntime.asSeconds()) * 100, 0);

      this.setState({ remaining, percentage });
    }
    , 50);

    if (event) {
      ReactGA.event({
        category: 'Timer',
        action: 'Started timer with mouse',
        label: this.props.name,
        value: Math.floor(this.state.remaining.asSeconds()),
      });
    } else {
      ReactGA.event({
        category: 'Timer',
        action: 'Started timer with keyboard',
        label: this.props.name,
        value: Math.floor(this.state.remaining.asSeconds()),
      });
    }
  }

  handleStopTimer(event) {
    clearInterval(this.timer);

    // Since interval only runs every 50ms, we need to calculate the
    // actual difference between start and end here for better precision
    const exactDiff = moment.duration(moment().diff(this.state.startTime))
      .add(this.state.previous);

    const remaining = moment.duration()
      .add(this.props.spawntime, 's')
      .subtract(exactDiff);

    // Store remaining time in previous, and update remaining to exact value
    this.setState({ active: false, previous: exactDiff, remaining });

    if (event) {
      ReactGA.event({
        category: 'Timer',
        action: 'Stopped timer with mouse',
        label: this.props.name,
        value: Math.floor(this.state.remaining.asSeconds()),
      });
    } else {
      ReactGA.event({
        category: 'Timer',
        action: 'Stopped timer with keyboard',
        label: this.props.name,
        value: Math.floor(this.state.remaining.asSeconds()),
      });
    }
  }

  handleResetTimer(event) {
    this.setState({
      startTime: moment(),
      previous: moment.duration(),
      remaining: moment.duration(this.state.spawntime),
    });

    if (event) {
      ReactGA.event({
        category: 'Timer',
        action: 'Reset timer with mouse',
        label: this.props.name,
        value: Math.floor(this.state.remaining.asSeconds()),
      });
    } else {
      ReactGA.event({
        category: 'Timer',
        action: 'Reset timer with keyboard',
        label: this.props.name,
        value: Math.floor(this.state.remaining.asSeconds()),
      });
    }
  }

  render() {
    return (
      <div className="card">
        <div className="card-header">
          <h4 className="card-title">{this.props.name}</h4>
          <h6 className="card-subtitle">
            {`${this.props.mapname}, lvl ${this.props.minlevel} - ${this.props.maxlevel}`}
            <br/>
            {this.state.spawntime.format("h [hrs] m [min] s [s]")}
          </h6>
        </div>
        <div className="card-body">
          <h2 className="timer-text">
            {this.state.remaining.format('hh:mm:ss', { trim: false, precision: 2 })}
          </h2>
          <div className="bar bar-sm">
            <div className="bar-item"
              role="progressbar"
              style={{width: `${this.state.percentage}%`}}
              aria-valuenow={`${this.state.percentage}`}
              aria-valuemin="0"
              aria-valuemax="100"></div>
          </div>
        </div>
        <div className="card-footer">
          <div className="popover popover-right">
            <div className="popover-container ml-5">
              <div className="card">
                <div className="card-body">
                  Press <kbd>{`${this.props.index}`}</kbd> to reset the timer.
                  Combination of <kbd>{`0 + ${this.props.index}`}</kbd> starts or stops the clock.
                </div>
              </div>
            </div>
            {this.state.active ?
              <button className="btn btn-primary" onClick={this.handleStopTimer}>
                Stop
              </button> :
              <button className="btn" onClick={this.handleStartTimer}>
                Start
              </button>
            }
            <button className="btn btn-link badge" onClick={this.handleResetTimer} data-badge={this.props.index}>
              Reset
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default Timer;
