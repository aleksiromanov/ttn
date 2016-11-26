import React from 'react';

export default class Issue extends React.Component {
  constructor() {
    super();
    this.state = {
      // route components are rendered with useful information, like URL params
      // user: findUserById(this.props.params.userId)
    };
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
            </p>
            <a href='#'> Read more </a>
          </article>

          <div>
            <button className="btn btn-outline-primary" type="button">
              Follow <span className="tag tag-pill tag-primary">1</span>
            </button>
            <button className="btn btn-outline-primary" type="button">
              Upvote <span className="tag tag-pill tag-primary">1</span>
            </button>
            <button className="btn btn-outline-primary" type="button">
              Downvote <span className="tag tag-pill tag-primary">1</span>
            </button>
            <button className="btn btn-outline-primary" type="button">
              Share <span className="tag tag-pill tag-primary">1</span>
            </button>
          </div>

          <div>
            <button className="btn btn-outline-primary" type="button">
              Demand New Head <span className="tag tag-pill tag-primary">1</span>
            </button>
            <input type='text' className='form-control reaction-input' placeholder='Add new reaction'/>
          </div>

        </issue>
      </div>
    )
  }
}
