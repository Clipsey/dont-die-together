import React from 'react';
import { Link } from 'react-router-dom'
import '../../style/stylesheets/reset.css'
import '../../style/stylesheets/app.css'
import '../../style//stylesheets/navbar.css'
import {Modal} from '../modal/modal'

class NavBar extends React.Component {
  constructor(props) {
    super(props);
    this.logoutUser = this.logoutUser.bind(this);
    this.getLinks = this.getLinks.bind(this);
  }

  logoutUser(e) {
    e.preventDefault();
    this.props.logout();
  }

  // Selectively render links dependent on whether the user is logged in
  getLinks() {
    if (this.props.loggedIn) {
      return (
        <div>
          <Link to={'/tweets'}>All Tweets</Link>
          <Link to={'/profile'}>Profile</Link>
          <Link to={'/new_tweet'}>Write a Tweet</Link>
          <button onClick={this.logoutUser}>Logout</button>
        </div>
      );
    } else {
      return (
        <div>
          <Link to={'/login'}>Login</Link>
          &nbsp;or&nbsp;
          <Link to={'/signup'}>Register</Link>
          {/* {this.props.openModal} */}
        </div>
      );
    }
  }

  render() {
    return (
      <div>
        <div className="navbar-top"></div>
        <div className="navbar-game-title">Don't Die Together</div>
        <div className="navbar-login-register">{this.getLinks()}</div>
      </div>
    );
  }
}

export default NavBar;