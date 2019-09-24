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

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      endpoint: 'localhost:5000',
      color: 'white',
      gameState: {
        player: {
          pos: [13, 13],
          health: 100,
        },
        bullets: [],
        enemies: [],
      }
    }
    this.send = this.send.bind(this);
    this.setColor = this.setColor.bind(this);
    this.setHealth = this.setHealth.bind(this);
    if (process.env.NODE_ENV === 'development') {
      this.socket = socketIOClient(this.state.endpoint);
    } else {
      this.socket = socketIOClient();
    }
  } 

  send() {
    this.socket.emit('change color', this.state.color);
    this.socket.emit('set gameState', this.state.gameState);
  }

  setColor(color) {
    return () => this.setState({ color })
  }

  setHealth(health) {
    return () => {
      const gameState = this.state.gameState;
      gameState['player']['health'] = health;
      return () => this.setState({ gameState });
    }
  }

  componentDidMount() {
    // setInterval(this.send, 1000);
    this.socket.on('change color', (col) => {
      document.body.style.backgroundColor = col;
    })
    this.socket.on('receive gameState', (receivedState) => {
      this.setState({ receivedState })
    })
  }

  render() {
    // const socket = socketIOClient(this.state.endpoint);
    return (
      <div>
        <button onClick={this.send}>Click</button>
        <button onClick={this.setColor('Red')}>Red</button>
        <button onClick={this.setColor('Blue')}>Blue</button>
        <button onClick={this.setHealth(100)}>Health = 100</button>
        <button onClick={this.setHealth(50)}>Health = 50</button>
        <div>{this.state.gameState.player.health}</div>
        <NavBarContainer />
        <Switch>
          <AuthRoute exact path="/" component={MainPage} />
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