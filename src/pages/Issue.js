import React from 'react';
import $ from 'jquery';
import { Link } from 'react-router';
import _ from 'lodash';


const ISSUES_COLLECTION_URL = 'http://localhost:27080/decisions/issues';
const getRandom = (limit=50) => {
  return Math.ceil((Math.random()*1000) % limit);
}
const NO_DB = true;
const getIssueStats = (issueId, cb) => {
  if(NO_DB) {
    cb({
      follow: 330,
      upvote: 204,
      downvote: 35,
      share: 147,
      'demand-new-head': 40,
    })
    return;
  }

    $.get(`${ISSUES_COLLECTION_URL}/_find?criteria=${escape('{"_id": '+issueId + '}')}`).done( (issue) => {

    }).fail( (responseText) => {
      try {
      let result = JSON.parse(responseText.responseText);
      }catch(e) {
        console.error(`Error occurde`, e)
        cb({
        follow: 0
      });
        return;
      }
      if(!result.ok) {
        alert(`Error occured, plz try again. Error msg: ${JSON.stringify(result)}`);
        return;
      }
      let issue = result.results[0];
      console.log (JSON.stringify(issue))
      cb({
        follow: issue.follow || 0,
        upvote: getRandom(),
        downvote: getRandom(),
        share: getRandom(),
        'demand-new-head': getRandom()
      })
    });
}

const increaseIssueStat = (issueId, issue, statsKey, cb) => {
    if(!NO_DB) {
      $.post(`${ISSUES_COLLECTION_URL}/_update`, "criteria=" + escape(`{"_id": ${issueId} }`) +"&amp;"+
      "newobj=" + escape('{"follow":1}&amp;') +"&amp;"+
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
    this.setState({
      [reactionId]: this.state[reactionId] + 1,
      didAction: true
    });

    increaseIssueStat(this.props.params.issueId, this.state.issue, reactionId, (response) => {
      console.log (`on inserting ${this.props.params.issueId}, server responded ${JSON.stringify(response)}` )
    });


  }
  render() {
    let issue = this.state.issue || {};
    let issueElem = 'Loading...';
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
                <a href={`https://dev.hel.fi/paatokset/asia/${issue.register_id.replace(' ', '-').toLowerCase()}`} target='_blank'> Read more </a>
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
              <button className="btn btn-outline-primary" type="button" data-reaction='demand-new-head' onClick={this.onReaction}>
                Demand New Head <span className="tag tag-pill tag-primary">{this.state['demand-new-head']}</span>
              </button>
              <input type='text' className='form-control reaction-input' placeholder='Add new reaction'/>
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
              <Link className='float-xs-right' to={`/issue/${Math.ceil(Math.random()*100)}`}> <button className='btn btn-outline-default mb-1'>Next Issue  >> </button></Link>
            </div>

            <div>
              <a href="https://www.facebook.com/TwoMinutesForMyCity/" target="_blank"> Join our FB page </a>
            </div>
        </issue>
      </div>
    }
    return (
      <div className='container'>
        {issueElem}
      </div>
    )
  }
}
