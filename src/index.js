// vim: sw=2:

import React from 'react';
import ReactDOM from 'react-dom';
import Issue from './pages/Issue.js'

import {Router, Redirect, IndexRoute, Route, useRouterHistory, browserHistory} from 'react-router';
import { createHashHistory } from 'history'
const appHistory = useRouterHistory(createHashHistory)({ queryKey: false })
ReactDOM.render(
  <Router history={appHistory}>
    <Route path="/issue/:issueId" component={Issue}/>
    <Redirect from="*" to="/issue/1"/>
  </Router>,
  document.getElementById('app')
);

