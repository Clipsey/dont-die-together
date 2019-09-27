import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { logout } from '../../actions/session_actions';
import {openModal} from '../../actions/modal_actions';

import NavBar from './navbar';

const mapStateToProps = state => ({
  loggedIn: state.session.isAuthenticated,
  currentUser: state.session.user.name
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  openModal: (
    <button className="channel-form-button" onClick={() => dispatch(openModal('login', ownProps))}>
      OPEN ME
    </button>
  ),
  logout: () => dispatch(logout()),
})

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(NavBar));