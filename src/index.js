// vim: sw=2:

import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();
import { Router, useRouterHistory } from 'react-router';
import { createHashHistory } from 'history';
import routes from './routes';
import Styles from './pages/Styles';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

ReactDOM.render(
  <MuiThemeProvider muiTheme={getMuiTheme({ palette: Styles.palette, appBar: Styles.appBar })} >
    <div>
      <Router
        history={useRouterHistory(createHashHistory)({ queryKey: false })}
        onUpdate={() => window.scrollTo(0, 0)}
      >
        {routes}
      </Router>
    </div>
  </MuiThemeProvider>,
  document.getElementById('app')
);

