import React from 'react';
import { withRouter } from 'react-router-dom';
import '../../style/stylesheets/reset.css';
import '../../style/stylesheets/app.css';
import '../../style/stylesheets/login_form.css';

class LoginForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      password: '',
      name: '',
      errors: {}
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.renderErrors = this.renderErrors.bind(this);
  }

  // Once the user has been authenticated, redirect to the Tweets page
  componentWillReceiveProps(nextProps) {
    if (nextProps.currentUser === true) {
      this.props.history.push('/game');
    }

    // Set or clear errors
    this.setState({ errors: nextProps.errors })
  }

  // Handle field updates (called in the render method)
  update(field) {
    return e => this.setState({
      [field]: e.currentTarget.value
    });
  }

  // Handle form submission
  handleSubmit(e) {
    e.preventDefault();

    let user = {
      name: this.state.name,
      password: this.state.password
    };

    this.props.login(user);
  }

  // Render the session errors if there are any
  renderErrors() {
    return (
      <ul>
        {Object.keys(this.state.errors).map((error, i) => (
          <li key={`error-${i}`}>
            {this.state.errors[error]}
          </li>
        ))}
      </ul>
    );
  }

  render() {
    return (
      <div>
        <div className="login-form-main">
              <br />
          <div className="login-form-banner">Login</div>
          <form onSubmit={this.handleSubmit}>
            <div>
              <input type="text"
                className="login-form-form"
                value={this.state.name}
                onChange={this.update('name')}
                placeholder="Name"
              />
              <br />
              <input type="password"
                className="login-form-form"
                value={this.state.password}
                onChange={this.update('password')}
                placeholder="Password"
              />
              <br />
              <input className="login-form-submit" type="submit" value="Submit" />
              <div className="login-form-form">{this.renderErrors()}</div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default withRouter(LoginForm);