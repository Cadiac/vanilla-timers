import React, { Component } from 'react';
import axios from 'axios';
import moment from 'moment';

import Timer from './Timer/Timer';
import './SearchPage.css'

const api = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
  timeout: 10000,
});

class SearchPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      query: '',
      results: [],
      timers: [],
    };

    this.handleSearchRequest = this.handleSearchRequest.bind(this);
    this.handleSearchQueryChange = this.handleSearchQueryChange.bind(this);
    this.handleAddTimer = this.handleAddTimer.bind(this);
  }

  handleAddTimer(name, spawntime) {
    this.setState({
      timers: this.state.timers.concat({
        name,
        spawntime,
        index: this.state.timers.length + 1
      }),
      results: [],
    });
  }

  handleSearchRequest(event) {
    event.preventDefault();

    api.get('/search', { params: { name: this.state.query } })
      .then(response =>
        this.setState({ results: response.data })
      );
  }

  handleSearchQueryChange(event) {
    this.setState({ query: event.target.value });
  }

  render() {
    return (
      <section className="container grid-960">
        <section className="columns">
          <div className="column col-12">
            <section className="empty">
              <div className="empty-icon">
                <i className="icon icon-time"></i>
              </div>
              {this.state.timers.length === 0 ? [
                <h4 key="h4" className="empty-title">You have not added any timers</h4>,
                <p key="p" className="empty-subtitle">Start by searching for an NPC</p>
              ] : (
                <h4 className="empty-title">Search for more NPCs</h4>
              )}
              <div className="form-autocomplete">
                <div className="empty-action input-group input-inline">
                  <input
                    className="form-input"
                    type="text"
                    value={this.state.query}
                    onChange={this.handleSearchQueryChange}
                    placeholder="Search NPC by name"
                  />
                  <button
                    onClick={this.handleSearchRequest}
                    className="btn btn-primary input-group-btn">
                    Search
                  </button>
                </div>
                {this.state.results.length > 0 &&
                  <ul className="menu">
                    {this.state.results.map((result, index) => ([
                      <li key={index} className="menu-item">
                        <div className="btn btn-link" onClick={() => this.handleAddTimer(result.name, result.spawntimesecs)}>
                          {`${result.name} - ${moment.duration(result.spawntimesecs, 's').format("h [hrs] m [min] s [s]")}`}
                        </div>
                      </li>,
                      <li className="divider"></li>
                    ]))}
                  </ul>
                }
              </div>
            </section>
          </div>
        </section>
        <section className="columns">
          {this.state.timers.map(timer =>
            <div className="column col-xl-3 col-lg-4 col-md-6 col-xs-12">
              <Timer
                key={timer.index}
                index={timer.index}
                name={timer.name}
                spawntime={timer.spawntime}
              />
            </div>
          )}
          <div className="column col-12">
            <button className="btn" onClick={() => this.handleAddTimer('Timer')}>
              Add timer
            </button>
          </div>
        </section>
      </section>
    );
  }
}

export default SearchPage;
