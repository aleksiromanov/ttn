// vim: sw=2:

import React from 'react';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';

export default class App extends React.Component {

  constructor() {
    super();
    this.state = {
    };
  }

  componentWillMount() {
    this.onChange = this.onChange.bind(this);
    this.state.content = this.renderFrontpage();
  }

  onChange(value) {
    switch (value) {
      case 'visits':
        break;
      default:
        alert(`No idea about ${value} ?!`);
        break;
    }
    return true;
  }

  renderVisits = () => ( <Visits />);

  renderFrontpage = () => (
    <div>
      <div style={{ margin: 12 }}>
        <label> Really Want an account? </label>
        <RaisedButton
          label={'Sign in'}
          disableTouchRipple
          disableFocusRipple
          secondary
          onTouchTap={ e => this.onChange('signin') }
          style={{ marginRight: 12 }}
        />
      </div>
      <div style={{ margin: 12 }}>
        <label> Otherwise </label>
        <RaisedButton
          label={'Sign up'}
          disableTouchRipple
          disableFocusRipple
          primary
          style={{ marginRight: 12 }}
          onTouchTap={ e => this.onChange('signup') }
        />
      </div>
    </div>
  );

  renderDefault = () => (
    <div>
      <Paper className="paper" zDepth={0} rounded={false} >
        {this.state.content}
      </Paper>
    </div>
  );

  render () {
    return this.renderDefault();
  }

}

