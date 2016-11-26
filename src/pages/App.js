// vim: sw=2:

import React from 'react';

export default class App extends React.Component {

  constructor() {
    super();
    this.state = {
    };
  }

  componentWillMount() {
    this.onClick = this.onClick.bind(this);
  }

  onClick() {
    alert('No idea about?!');
  }

  render () {
    return <div className='container'>
      <button className='btn' onClick={this.onClick}> Sign in </button>
    </div>
  }

}

