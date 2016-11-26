// vim: sw=2:

import React from 'react';
import ReactDOM from 'react-dom';
// import injectTapEventPlugin from 'react-tap-event-plugin';
// injectTapEventPlugin();
import App from './pages/App.js'
import { Router, IndexRoute, Route, useRouterHistory, browserHistory} from 'react-router';

ReactDOM.render(
  <Router history={browserHistory}>
    <Route path="*" component={App}>
    </Route>
  </Router>,
  document.getElementById('app')
);

