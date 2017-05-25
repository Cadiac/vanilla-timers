import React, { Component } from 'react';
import axios from 'axios';
import moment from 'moment';
import { debounce } from 'lodash';

import ReactGA from 'react-ga';

import Timer from './Timer/Timer';
import './SearchPage.css'

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 10000,
});

ReactGA.initialize('UA-98173348-2');
ReactGA.pageview('/');

class SearchPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      query: '',
      results: [],
      timers: [],
      resultsVisible: false,
      loading: false,
    };

    this.searchRequest = debounce(this.searchRequest.bind(this), 300);

    this.handleSearchRequest = this.handleSearchRequest.bind(this);
    this.handleSearchQueryChange = this.handleSearchQueryChange.bind(this);
    this.handleAddTimer = this.handleAddTimer.bind(this);

    this.handleSearchBlur = this.handleSearchBlur.bind(this);
    this.handleSearchFocus = this.handleSearchFocus.bind(this);
  }

  handleAddTimer(name, spawntime, mapname, minlevel, maxlevel) {
    ReactGA.event({
      category: 'Timer',
      action: 'Added an timer',
      label: name,
    });
    this.setState({
      timers: this.state.timers.concat({
        name,
        spawntime,
        index: this.state.timers.length + 1,
        mapname,
        minlevel,
        maxlevel,
      }),
    });
  }

  searchRequest() {
    if (this.state.query.length > 0) {
      ReactGA.event({
        category: 'Search',
        action: 'Searched for NPC',
        label: this.state.query,
      });

      this.setState({ loading: true });

      api.get('/search', { params: { name: this.state.query } })
        .then(response =>
          this.setState({ results: response.data, resultsVisible: true, loading: false })
        );
    } else {
      ReactGA.event({
        category: 'Search',
        action: 'Empty search',
      });
    }
  }

  handleSearchRequest(event) {
    event.preventDefault();

    this.searchRequest();
  }

  handleSearchQueryChange(event) {
    this.setState({ query: event.target.value });

    this.searchRequest();
  }

  handleSearchBlur(event) {
    this.setState({ resultsVisible: false });
  }

  handleSearchFocus(event) {
    if (this.state.query.length > 0) {
      this.setState({ resultsVisible: true });
    }
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
              <div className="form-autocomplete"
                onFocus={this.handleSearchFocus}
                onBlur={this.handleSearchBlur}>
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
                    className={`btn btn-primary input-group-btn ${this.state.loading ? 'loading' : ''}`}>
                    Search
                  </button>
                </div>
                {this.state.resultsVisible &&
                  <ul className="menu">
                    {this.state.results.length > 0 ?
                      this.state.results.map((result, index) => ([
                        <li key={index} className="menu-item" onMouseDown={() =>
                          this.handleAddTimer(
                            result.name,
                            result.spawntimesecs,
                            result.mapname,
                            result.minlevel,
                            result.maxlevel
                          )
                        }>
                          <div className="menu-badge">
                            <label className="label label-primary mr-5">{`${result.mapname}`}</label>
                            <label className={`label ${result.maxlevel >= 60 ? 'label-error' : 'label-warning'} ml-5`}>
                              {`lvl ${result.minlevel}-${result.maxlevel}`}
                            </label>
                          </div>
                          <div className="btn btn-link">
                            {`${result.name} - ${moment.duration(result.spawntimesecs, 's').format("h [hrs] m [min] s [s]")}`}
                          </div>
                        </li>,
                        <li className="divider"></li>
                      ])) : (
                        <li key='noresults' className="menu-item">
                          <div className="btn btn-link">
                            No results :(
                          </div>
                        </li>
                      )
                    }
                  </ul>
                }
              </div>
            </section>
          </div>
        </section>
        <section className="columns">
          {this.state.timers.map(timer =>
            <div key={timer.index} className="column col-xl-4 col-lg-4 col-md-6 col-xs-12">
              <Timer
                index={timer.index}
                name={timer.name}
                spawntime={timer.spawntime}
                mapname={timer.mapname}
                minlevel={timer.minlevel}
                maxlevel={timer.maxlevel}
              />
            </div>
          )}
        </section>
      </section>
    );
  }
}

export default SearchPage;
