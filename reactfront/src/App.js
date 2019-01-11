import React, { Component } from 'react';
import './App.css';
import FileSystemPage from './component/fileSystemPage';
import {Router, Route, hashHistory} from 'react-router';
import Player from "./component/player";

class App extends Component {
  render() {
    return (
      <div style={{height:'100%'}}>
        <Router history={hashHistory}>
          <Route path='/' component={FileSystemPage}/>
          <Route path='/video/:path' component={Player}/>
        </Router>
      </div>
    );
  }
}

export default App;
