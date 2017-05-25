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

    // Bind '{index}' to reset, '0 {index}' to start/stop
    Mousetrap.bind(`${props.index}`, this.handleResetTimer);
    Mousetrap.bind(`0 ${props.index}`, () => this.state.active ?
      this.handleStopTimer() :
      this.handleStartDescendingTimer());
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
          <h4 className="card-title">{this.props.name}</h4>
          <h6 className="card-subtitle">
            {`${this.props.mapname}, lvl ${this.props.minlevel} - ${this.props.maxlevel}`}
            <br/>
            {this.state.spawntime.format("h [hrs] m [min] s [s]")}
          </h6>
        </div>
        <div className="card-body">
          <h2>{this.state.elapsed.format('hh:mm:ss', { trim: false, precision: 2 })}</h2>
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
              <button className="btn" onClick={this.handleStartDescendingTimer}>
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
