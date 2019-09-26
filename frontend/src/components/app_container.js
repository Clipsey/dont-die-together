import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import App from './app';

const mapStateToProps = (state, ownProps) => {
  return {
    loggedIn: state.session.isAuthenticated,
    currentUser: state.session.user,
    users: state.users.users,
  };
};

const mapDispatchToProps = dispatch => {
  return {
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));