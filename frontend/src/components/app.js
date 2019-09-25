import React from 'react';
// import { socketInit } from '../util/sockets_util';
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
import JoinGameSessionContainer from './game/join_game_session_container'
import CreateGameSessionContainer from './game/create_game_session.js'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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
  } 

  send() {
    this.props.emit('change color', this.state.color);
    this.props.emit('set gameState', this.state.gameState);
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
    this.props.subscribe('change color', (col) => {
      document.body.style.backgroundColor = col;
    })
    this.props.subscribe('receive gameState', (receivedState) => {
      debugger;
      this.setState({ gameState: receivedState })
    })
  }

  render() {
    return (
      <div className="app">
        <button onClick={this.send}>Click</button>
        <br></br>
        <button onClick={this.setHealth(100)}>Health = 100</button>
        <br></br>
        <button onClick={this.setHealth(50)}>Health = 50</button>
        <div>{this.state.gameState.player.health}</div>
        <NavBarContainer />
        <Switch>
          <AuthRoute exact path="/" component={MainPage} />
          <AuthRoute exact path="/login" component={LoginFormContainer} />
          <AuthRoute exact path="/signup" component={SignupFormContainer} />

          <ProtectedRoute exact path="/joingame" component={JoinGameSessionContainer} />
          <ProtectedRoute exact path="/creategame" component={CreateGameSessionContainer} />
          <ProtectedRoute exact path="/game" component={Game} />
          {/* <ProtectedRoute exact path="/tweets" component={TweetsContainer} /> */}
          {/* <ProtectedRoute exact path="/profile" component={ProfileContainer} /> */}
          {/* <ProtectedRoute exact path="/new_tweet" component={TweetComposeContainer} /> */}
        </Switch>
      </div>
    )
  }
};

export default App;