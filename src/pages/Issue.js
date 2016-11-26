import React from 'react';
import $ from 'jquery';
import { Link } from 'react-router';
import _ from 'lodash';

const getRandom = (limit=50) => {
  return Math.ceil((Math.random()*1000) % limit);
}

const getIssueStats = (issueId, cb) => {
  setTimeout(() => {
    cb({
      follow: getRandom(),
      upvote: getRandom(),
      downvote: getRandom(),
      share: getRandom(),
      'demand-new-head': getRandom()
    })
  }, 50)
}

const increaseIssueStat = (statsKey) => {

}

export default class Issue extends React.Component {
  constructor() {
    super();
    this.onReaction = this.onReaction.bind(this);
    this.loadIssue = this.loadIssue.bind(this);

    this.state = {
      follow: 330,
      upvote: 204,
      downvote: 35,
      share: 147,
      'demand-new-head': 40,
      didAction: false,
      issue: null,
      loaded: false
    };
  }

  componentDidMount() {
    this.loadIssue(this.props.params.issueId);
  }

  componentWillReceiveProps(newProps) {
    this.loadIssue(newProps.params.issueId)
  }

  loadIssue(issueId) {
    this.setState({
        loaded: false
    })
    getIssueStats(issueId, (issue) => {
      this.setState(_.extend({
        loaded: true
      },issue));
    })
    $.get(`http://dev.hel.fi/openahjo/v1/issue/${issueId}/?format=json`).
    done((data) => {
      this.setState({
        issue: data
      })
    })
    .fail( (error) => {
      alert(`Error occured, plz try again. Error msg: ${JSON.stringify(error)}`);
    })
  }

  onReaction(event) {
    const reactionId = $(event.currentTarget).attr('data-reaction');
    this.setState({
      [reactionId]: this.state[reactionId] + 1,
      didAction: true
    });
  }
  render() {
    let issue = this.state.issue || {};
    let issueElem = 'Loading...';
    if(this.state.loaded) {
      issueElem =
      <issue>
          <article>
            <h2>
              <a> &lt;&lt; </a>
              {issue.subject}
            </h2>
            <p>
              {issue.summary}
              <a href='#'> Read more </a>
            </p>
          </article>

          <div>
            <button className="btn btn-outline-primary" type="button" data-reaction='follow' onClick={this.onReaction}>
              Follow <span className="tag tag-pill tag-primary">{this.state.follow}</span>
            </button>
            <button className="btn btn-outline-primary" type="button" data-reaction='upvote' onClick={this.onReaction}>
              Upvote <span className="tag tag-pill tag-primary">{this.state.upvote}</span>
            </button>
            <button className="btn btn-outline-primary" type="button" data-reaction='downvote' onClick={this.onReaction}>
              Downvote <span className="tag tag-pill tag-primary">{this.state.downvote}</span>
            </button>
            <button className="btn btn-outline-primary" type="button" data-reaction='share' onClick={this.onReaction}>
              Share <span className="tag tag-pill tag-primary">{this.state.share}</span>
            </button>
          </div>

          <form className="form-inline">
            <button className="btn btn-outline-primary" type="button" data-reaction='demand-new-head' onClick={this.onReaction}>
              Demand New Head <span className="tag tag-pill tag-primary">{this.state['demand-new-head']}</span>
            </button>
            <input type='text' className='form-control reaction-input' placeholder='Add new reaction'/>
          </form>

          <button className={`btn btn-primary involve-btn mt-2 ${!this.state.didAction?'invisible':''}`}>
            Petitiong
          </button>
          <button className={`btn btn-primary involve-btn mt-2 ${!this.state.didAction?'invisible':''}`}>
            Make meeting on FB
          </button>

          <div>
            <Link className='float-xs-right' to={`/issue/${Math.ceil(Math.random()*100)}`}> <button className='btn btn-outline-default'>Next Issue  >> </button></Link>
          </div>

      </issue>
    }
    return (
      <div className='container'>
        {issueElem}
      </div>
    )
  }
}
