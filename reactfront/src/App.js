import React, { Component } from 'react';
import './App.css';
import FileSystemPage from './component/fileSystemPage'
import {Router, Route, hashHistory} from 'react-router';


class App extends Component {
  render() {
    return (
      <div style={{height:'100%'}}>
        <Router history={hashHistory}>
          <Route path='/' component={FileSystemPage}/>
        </Router>
      </div>
    );
  }
}

export default App;
