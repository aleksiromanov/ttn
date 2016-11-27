import React from 'react';
import $ from 'jquery';
import { Link } from 'react-router';
import _ from 'lodash';


const ISSUES_COLLECTION_URL = window.location.toString().match('localhost|file')?'http://localhost:27080/decisions/issues':'/mongo/decisions/issues';
const getRandom = (limit=50) => {
  return Math.ceil((Math.random()*1000) % limit);
}
const NO_DB = false;
const getIssueStats = (issueId, cb) => {
  if(NO_DB) {
    cb({
      follow: 330,
      upvote: 204,
      downvote: 35,
      share: 147,
      'demand-more-info': 40,
    })
    return;
  }

    $.get(`${ISSUES_COLLECTION_URL}/_find?criteria=${escape('{"_id": '+issueId + '}')}`).done( (result) => {
      let issue = _.get(result, 'results.0', {});
      console.log(JSON.stringify(issue))
      cb(_.extend({
        follow: 0,
        upvote: 0,
        downvote: 0,
        share: 0,
        'demand-more-info': 0,
        'too-small-budget': 0,
        'too-expensive': 0
      },_.omit(issue, '_id')))
     }).fail( (responseText) => {
        alert(`Error occured, plz try again. Error msg: ${JSON.stringify(responseText)}`);
      }
    );
}

const increaseIssueStat = (issueId, issue, statsKey, newCount, cb) => {
    if(!NO_DB) {
      $.post(`${ISSUES_COLLECTION_URL}/_update`, "criteria=" + escape(`{"_id": ${issueId} }`) +"&amp;"+
      "newobj=" + escape(`{"$set" : {"${statsKey}": ${newCount}}}`) +"&amp;"+
      "upsert=true").done( (response) => {
      cb(response);
    }).fail( (error) => {
      alert(`Error occured, plz try again. Error msg: ${JSON.stringify(error)}`);
    });
  }
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
      'demand-more-info': 40,
      'too-small-budget': 23,
      'too-expensive': 123,
      didAction: false,
      issue: null,
      loaded: false
    };
  }

  componentDidMount() {
    this.loadIssue(this.props.params.issueId);
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      prevState: null
    })
    this.loadIssue(newProps.params.issueId);
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
    $.ajax({
      url: `https://dev.hel.fi/openahjo/v1/issue/${issueId}/?format=jsonp`,
      dataType: 'JSONP',
      jsonpCallback: 'callback',
      type: 'GET'
    }).done((data) => {
      this.setState({
        issue: data
      })
    }).fail( (error) => {
      alert(`Error occured, plz try again. Error msg: ${JSON.stringify(error)}`);
    })
  }

  onReaction(event) {
    const reactionId = $(event.currentTarget).attr('data-reaction');
    let prevReactionCount = _.get(this.state,`prevState.${reactionId}`)
    if( _.isNumber(prevReactionCount) &&  prevReactionCount !== _.get(this.state,`${reactionId}`)) {
      console.log ('Already upvoted. skipping..')
      return;
    }
    const newCount = this.state[reactionId] + 1;
    this.setState({
      prevState: _.extend({}, this.state.prevState, {[reactionId]: this.state[reactionId] || 0}),
      [reactionId]: newCount,
      didAction: true
    });
    increaseIssueStat(this.props.params.issueId, this.state.issue, reactionId, newCount,(response) => {
      console.log (`on inserting ${this.props.params.issueId}, server responded ${JSON.stringify(response)}` )
    });


  }
  render() {
    let issue = this.state.issue || {};
    let issueElem = 'Loading...';
    let issuesPool = [31660, 32319, 32323, 32320, 32324, 32325, 32326];
    console.log(getRandom(issuesPool.length))
    if(this.state.loaded) {
      issueElem =
      <div>
          <h1>
            Two Minutes For My City
          </h1>
        <issue>

            <article>
              <h2 className="mt-1">
                {issue.subject}
              </h2>
              <p>
                {issue.summary}
                <a href={`https://dev.hel.fi/paatokset/asia/${issue.register_id && issue.register_id.replace(' ', '-').toLowerCase()}`} target='_blank'> Read more </a>
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
              <a className="btn btn-outline-primary"
                data-reaction='share'
                onClick={this.onReaction}
                href= {'http://www.facebook.com/sharer.php?u=' + escape(window.location)}
                target="_blank">
                Share <span className="tag tag-pill tag-primary">{this.state.share}</span>
              </a>
            </div>

            <form className="form-inline">
              <button className="btn btn-outline-primary" type="button" data-reaction='demand-more-info' onClick={this.onReaction}>
                Demand More Information <span className="tag tag-pill tag-primary">{this.state['demand-more-info']}</span>
              </button>
              <button className="btn btn-outline-primary" type="button" data-reaction='too-expensive' onClick={this.onReaction}>
                Too expensive! <span className="tag tag-pill tag-primary">{this.state['too-expensive']}</span>
              </button>
              <button className="btn btn-outline-primary" type="button" data-reaction='too-small-budget' onClick={this.onReaction}>
                Too small budget! <span className="tag tag-pill tag-primary">{this.state['too-small-budget']}</span>
              </button>
            </form>

            <a className={`btn btn-primary involve-btn mt-2 ${!this.state.didAction?'invisible':''}`}
               href="https://www.kansalaisaloite.fi/fi/aloite"
                target="_blank">
              Make a Petition
            </a>
            <a className={`btn btn-primary involve-btn mt-2 ${!this.state.didAction?'invisible':''}`}
              href={`https://www.facebook.com/search/events/?q=${escape(issue.subject)}`}
              target="_blank">
              Make meeting on FB
            </a>

            <div>
              <Link className='float-xs-right' to={`/issue/${issuesPool[getRandom(issuesPool.length)-1]}`}> <button className='btn btn-outline-default mb-1'>Next Issue  >> </button></Link>
            </div>

            <div>
              <a href="https://www.facebook.com/TwoMinutesForMyCity/" target="_blank"> Join our FB page </a>
            </div>
        </issue>
      </div>
    }
    // 31660, 32319, 32323, 32320, 32324
    return (
      <div className='container'>
        {issueElem}
      </div>
    )
  }
}
