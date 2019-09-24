import React from 'react';
import socketIOClient from 'socket.io-client';
import { AuthRoute, ProtectedRoute } from '../util/route_util';
import { Switch } from 'react-router-dom';
import NavBarContainer from './nav/navbar_container';
import TweetsContainer from './tweets/tweets_container';
import MainPage from './main/main_page';
import LoginFormContainer from './session/login_form_container';
import SignupFormContainer from './session/signup_form_container';
import ProfileContainer from './profile/profile_container';
import TweetComposeContainer from './tweets/tweet_compose_container';
import Game from './game/game';
import Modal from './modal/modal';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      endpoint: 'localhost:5000',
      // endpoint: ''
      color: 'white'
    }
    this.send = this.send.bind(this);
    this.setColor = this.setColor.bind(this);
    // this.socket = socketIOClient(this.state.endpoint);
    this.socket = socketIOClient();
  }

  send() {
    // debugger;
    // const socket = socketIOClient(this.state.endpoint);
    this.socket.emit('change color', this.state.color);
  }

  setColor(color) {
    return () => this.setState({color})
  }

  componentDidMount() {
    // const socket = socketIOClient(this.state.endpoint);
    // setInterval(this.send, 1000);
    this.socket.on('change color', (col) => {
      document.body.style.backgroundColor = col;
    })
  }

  render() {
    // const socket = socketIOClient(this.state.endpoint);
    // this.socket(this.state.endpoint);
    return (
      <div className="app">
        <button onClick={this.send}>Click</button>
        <button onClick={this.setColor('Red')}>Red</button>
        <button onClick={this.setColor('Blue')}>Blue</button>
        <NavBarContainer />
        <Switch>
          <AuthRoute exact path="/" component={MainPage} />
          <AuthRoute exact path="/game" component={Game} />
          <AuthRoute exact path="/login" component={LoginFormContainer} />
          <AuthRoute exact path="/signup" component={SignupFormContainer} />

          <ProtectedRoute exact path="/tweets" component={TweetsContainer} />
          <ProtectedRoute exact path="/profile" component={ProfileContainer} />
          <ProtectedRoute exact path="/new_tweet" component={TweetComposeContainer} />
        </Switch>
      </div>
    )
  }
};

export default App;