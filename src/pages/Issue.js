import React from 'react';
import $ from 'jquery';
import { Link } from 'react-router';
import _ from 'lodash';


const translateToLocalLanguage = (text, cb) => {
  if(navigator.language.toLowerCase().match('fi') || navigator.language.toLowerCase().match('se')) {
    cb(text);
    return;
  }
  $.get(`https://www.googleapis.com/language/translate/v2?q=${escape(text)}&target=en&format=text&source=fi&key=AIzaSyB9ucX9ZnYJpUIm9tZWxP_pzvLZGO7OD4o`).
  done((result) => {
    cb(_.get(result, 'data.translations[0].translatedText')+' (translated)' || text)
  }).fail((err) => {
    console.error(err);
    cb(text);
  })
};

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

const commonFields = ['issue', 'loaded', 'prevState']
const nonCustomFields = ['_id', 'follow','upvote','downvote','share','demand-more-info','too-small-budget','too-expensive', 'didAction', 'issue', 'loaded', 'prevState'];
export default class Issue extends React.Component {
  constructor() {
    super();
    this.onReaction = this.onReaction.bind(this);
    this.loadIssue = this.loadIssue.bind(this);
    this.onCustomAdd = this.onCustomAdd.bind(this);

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
    let dropedKeysObj = _.cloneDeep(this.state);
    _.omit(dropedKeysObj, commonFields);
    dropedKeysObj = _.mapValues(dropedKeysObj, (val) => {
      return null;
    })


    getIssueStats(issueId, (issue) => {
      this.setState(_.extend(dropedKeysObj, {
        loaded: true
      }, issue));
    })
    $.ajax({
      url: `https://dev.hel.fi/openahjo/v1/issue/${issueId}/?format=jsonp`,
      dataType: 'JSONP',
      jsonpCallback: 'callback',
      type: 'GET'
    }).done((data) => {
      if (data.redirect) {
        window.location.href = data.redirect;
      }
      else {
        translateToLocalLanguage(data.summary || '', (summary) => {
          translateToLocalLanguage(data.subject || '', (subject) => {
           this.setState({
            issue: _.extend({}, data, {
              summary: summary,
              subject: subject
            })
          })
          })
        })
      }
    }).fail( (error) => {
      alert(`Error occured, plz try again. Error msg: ${JSON.stringify(error)}`);
    })
  }

  onCustomAdd(e) {
    const reactionId = $('#customOpinionInput').val();
    if (reactionId) {
      $('#customOpinionInput').val('');
      this.setState({
        [reactionId]: 1
      })
      increaseIssueStat(this.props.params.issueId, this.state.issue, reactionId, 1,(response) => {
        console.log (`on inserting ${this.props.params.issueId}, server responded ${JSON.stringify(response)}` )
      });
      e.preventDefault()
    }
  }

  getButtonStatus(reactionId) {
    let prevReactionCount = _.get(this.state,`prevState.${reactionId}`)
    if( _.isNumber(prevReactionCount) &&  prevReactionCount !== _.get(this.state,`${reactionId}`)) {
    return "btn-primary"

    } else {
    return "btn-outline-primary"

    }
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
    let issuesPool = [25435,24524, 32319, 32320, 31660];
    console.log(getRandom(issuesPool.length))
    if(this.state.loaded) {
      const customOpinions = _.omit(this.state, nonCustomFields)

      let customOpinionsElem = _.map(_.keys(customOpinions).sort((a,b) =>{return this.state[b] - this.state[a]}), (key) => {
        if (!_.isNumber(this.state[key])) return ''
        return  <button key={key} className={"btn " + this.getButtonStatus(key)} type="button" data-reaction={key} onClick={this.onReaction}>
                {key} <span className="tag tag-pill tag-primary">{this.state[key]}</span>
              </button>
      })
      issueElem =
      <div>
          <h5>
            Two Minutes For My City presents
          </h5>

        <issue>

            <article>
              <h2 className="mt-1 request-text">
                What do you think about:
                <Link className='float-xs-right' to={`/issue/${issuesPool[getRandom(issuesPool.length)-1]}`}> <button className='btn btn-primary mb-1 next-issue-top-button'>Next Issue  >> </button></Link>

              </h2>
              <h3>
               {issue.subject}
              </h3>
              <p>
                {_.get(issue,'summary') && issue.summary.substr(0, 150)+ '...'}
                <a href={`https://dev.hel.fi/paatokset/asia/${issue.register_id && issue.register_id.replace(' ', '-').toLowerCase()}`} target='_blank'> Read more </a>
              </p>
            </article>
            <div>
              <p className="motivate-text"> <b>Make them hear your voice: </b> </p>
            </div>
            <div>
              <button className={"btn " + this.getButtonStatus("follow")} type="button" data-reaction='follow' onClick={this.onReaction}>
                Follow <span className="tag tag-pill tag-primary">{this.state.follow}</span>
              </button>
              <button className={"btn " + this.getButtonStatus("upvote")} type="button" data-reaction='upvote' onClick={this.onReaction}>
                Upvote <span className="tag tag-pill tag-primary">{this.state.upvote}</span>
              </button>
              <button className={"btn " + this.getButtonStatus("downvote")} type="button" data-reaction='downvote' onClick={this.onReaction}>
                Downvote <span className="tag tag-pill tag-primary">{this.state.downvote}</span>
              </button>
              <a className={"btn " + this.getButtonStatus("share")}
                data-reaction='share'
                onClick={this.onReaction}
                href= {'http://www.facebook.com/sharer.php?u=' + escape(window.location)}
                target="_blank">
                Share <span className="tag tag-pill tag-primary">{this.state.share}</span>
              </a>
            </div>

            <form className="form-inline">
              <button className={"btn " + this.getButtonStatus("demand-more-info")} type="button" data-reaction='demand-more-info' onClick={this.onReaction}>
                Demand More Information <span className="tag tag-pill tag-primary">{this.state['demand-more-info']}</span>
              </button>
              <button className={"btn " + this.getButtonStatus("too-expensive")} type="button" data-reaction='too-expensive' onClick={this.onReaction}>
                Too expensive! <span className="tag tag-pill tag-primary">{this.state['too-expensive']}</span>
              </button>
              <button className={"btn " + this.getButtonStatus("too-small-budget")} type="button" data-reaction='too-small-budget' onClick={this.onReaction}>
                Too small budget! <span className="tag tag-pill tag-primary">{this.state['too-small-budget']}</span>
              </button>
              {customOpinionsElem}
            </form>

            <form onSubmit={this.onCustomAdd} className="form-inline">
                <input type='text' placeholder='Your custom opinion here' maxLength={20} id='customOpinionInput' className='form-control'/>
                <button className='btn btn-default add-button' type="submit"> Add </button>
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
              <Link className='float-xs-right' to={`/issue/${issuesPool[getRandom(issuesPool.length)-1]}`}> <button className='btn btn-primary mb-1 next-issue-bottom-button'>Next Issue  >> </button></Link>
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
