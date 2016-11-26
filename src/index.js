// vim: sw=2:

import React from 'react';
import ReactDOM from 'react-dom';
// import injectTapEventPlugin from 'react-tap-event-plugin';
// injectTapEventPlugin();
import App from './pages/App.js'
import Issue from './pages/Issue.js'

import {Router, IndexRoute, Route, useRouterHistory, browserHistory} from 'react-router';
import { createHashHistory } from 'history'
const appHistory = useRouterHistory(createHashHistory)({ queryKey: false })
ReactDOM.render(
  <Router history={appHistory}>
    <Route path="/issue/:issueId" component={Issue}/>
    <Route path="*" component={App}/>
  </Router>,
  document.getElementById('app')
);

