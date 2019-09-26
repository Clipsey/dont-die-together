import React from 'react';
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
import CreateGameSessionContainer from './game/create_game_session_container.js'
import '../style/stylesheets/snowy.css'

import socketIOClient from 'socket.io-client';
import { emitSetup, onSetup } from '../util/sockets_util';

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
      },
      sockets: {}
    }
    this.send = this.send.bind(this);
    this.setColor = this.setColor.bind(this);
    this.setHealth = this.setHealth.bind(this);
    this.getState = props.getState;

    this.socket = null;
    this.room = null;

    this.createSocket = this.createSocket.bind(this);
  }
  
  createSocket() {
    
    // this.socket.removeAllListeners();
    if (this.socket !== null) this.socket.disconnect();

    this.room = this.getState().session.user.id;

    if (process.env.NODE_ENV === 'development') {
      this.socket = socketIOClient('localhost:5000', { query: {room: this.room } });
    } else {
      this.socket = socketIOClient(window.location, { query: {room: this.room } });
    }
    
    // this.emit('join room', String(this.getState().session.user.id));

    // this.on('room change', room => {
    //   console.log('room cahnge');
    // })
  
    this.socket.on('change color', (col) => {
      document.body.style.backgroundColor = col;
    });
    this.socket.on('receive gameState', (receivedState) => {
      console.log('receive');
      this.setState({ gameState: receivedState })
    });

    if (process.env.NODE_ENV === 'development') {
      this.socket = socketIOClient('localhost:5000', { query: { room: this.room } });
    } else {
      this.socket = socketIOClient(window.location, { query: { room: this.room } });
    }
    this.emit = emitSetup(this.socket);
    this.on = onSetup(this.socket);
 
  }
  
  connectSocket(username) {

    if (this.socket !== null) this.socket.disconnect();

    // Get host user's session id, connect to that room
    const host = this.getState().users;
    // this.room = this.getState().users;

    // if (process.env.NODE_ENV === 'development') {
    //   this.socket = socketIOClient('localhost:5000', { query: { room: this.room } });
    // } else {
    //   this.socket = socketIOClient(window.location, { query: { room: this.room } });
    // }
     
    // let socket;
    // if (process.env.NODE_ENV === 'development') {
    //   socket = socketIOClient('localhost:5000');
    // } else {
    //   socket = socketIOClient();
    // }

    // this.emit = emitSetup(socket);
    // this.on = onSetup(socket);

    // this.on('change color', (col) => {
    //   document.body.style.backgroundColor = col;
    // })
    // this.on('receive gameState', (receivedState) => {
    //   this.setState({ gameState: receivedState })
    // })

    // setInterval(this.send, 1000);`
  }

  send() {
    // this.emit('change color', this.state.color);
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

  render() {
    return (
      <div className="snow">
        <div className="app">
          <button onClick={this.createSocket}>Create</button>
          <br></br>
          <br></br>
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

            <AuthRoute exact path="/joingame" createSocket={this.createSocket} connectSocket={this.connectSocket} component={JoinGameSessionContainer} />} />
            <AuthRoute exact path="/creategame" createSocket={this.createSocket} connectSocket={this.connectSocket} component={CreateGameSessionContainer} />

            <AuthRoute exact path="/game" component={Game} />
            {/* <ProtectedRoute exact path="/tweets" component={TweetsContainer} /> */}
            {/* <ProtectedRoute exact path="/profile" component={ProfileContainer} /> */}
            {/* <ProtectedRoute exact path="/new_tweet" component={TweetComposeContainer} /> */}
          </Switch>
        </div>
      </div>
    )
  }
};

export default App;