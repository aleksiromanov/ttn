// vim: sw=2:

import React from 'react';
import ReactDOM from 'react-dom';
// import injectTapEventPlugin from 'react-tap-event-plugin';
// injectTapEventPlugin();
import App from './pages/App.js'
import Issue from './pages/Issue.js'

import {Router, IndexRoute, Route, useRouterHistory, browserHistory} from 'react-router';

ReactDOM.render(
  <Router>
    <Route path="/issue/:issueId" component={Issue}/>
    <Route path="*" component={App}/>
  </Router>,
  document.getElementById('app')
);

