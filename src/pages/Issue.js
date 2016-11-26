import React from 'react';
import $ from 'jquery';

export default class Issue extends React.Component {
  constructor() {
    super();
    this.state = {
      follow: 330,
      upvote: 204,
      downvote: 35,
      share: 147,
      'demand-new-head': 40
    };
    this.onReaction = this.onReaction.bind(this);
  }

  onReaction(event) {
    const reactionId = $(event.currentTarget).attr('data-reaction');
    this.setState({ [reactionId]: this.state[reactionId] + 1});
  }
  render() {
    return (
      <div className='container'>
        <issue>
          <article>
            <h2>
              <a> &lt;&lt; </a>
              Approval of the Agreement on the implementation of the Guggenheim Helsinki Museum
            </h2>
            <h3> Decision </h3>

            <p>
              The City decided to put the issue on the table for two weeks.
              <br/>
              Disabled groups: Pilvi Torsti
              <br/>
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

          <button className='btn btn-primary involve-btn mt-2'> Get me involved! </button>

        </issue>
      </div>
    )
  }
}
