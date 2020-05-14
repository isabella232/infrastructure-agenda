import React from 'react';
import { Link } from "react-router-dom";

class Developer extends React.Component {
  render() {
    return <div className="container">
      <h1>Developer tools</h1>

      <dl className="row">
        <dt className="col-sm-2"><Link to="/store/">Store</Link></dt>
        <dd className="col-sm-10">A live view of the <a href="https://react-redux.js.org/">React Redux</a> store.</dd>

        <dt className="col-sm-2"><Link to="/server/">Server</Link></dt>
        <dd className="col-sm-10">Request live data from the server.</dd>

        <dt className="col-sm-2"><Link to="/cache/">Cache</Link></dt>
        <dd className="col-sm-10">Show the cache of responses to HTTP GET requests.</dd>
      </dl>

      <p>See also: <Link to="/docs/">Documentation/Guides</Link>.</p>
    </div>
  }
}

export default Developer;