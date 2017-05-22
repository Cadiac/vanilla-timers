import React, { Component } from 'react';
// import Search from './Search';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
  timeout: 10000,
});

import './SearchPage.css';

class SearchPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      query: '',
      results: []
    };

    this.handleSearchRequest = this.handleSearchRequest.bind(this);
    this.handleSearchQueryChange = this.handleSearchQueryChange.bind(this);
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
      <div className="SearchPage">
        <div className="SearchPage-header">
          <h2>Search</h2>
          <p>
            {`Search for NPC by name.`}
          </p>
        </div>
        <form onSubmit={this.handleSearchRequest}>
          <label>
            <input type="text" value={this.state.query} onChange={this.handleSearchQueryChange} placeholder="Name"/>
          </label>
          <input type="submit" value="Search" />
        </form>
        <div className="SearchPage-Searchs">
          {this.state.results.map(result => (
            <div>{`${result.name} - ${result.spawntimesecs} sec`}</div>
          ))}
        </div>
      </div>
    );
  }
}

export default SearchPage;
