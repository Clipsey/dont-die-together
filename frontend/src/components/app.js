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
import JoinGameSessionContainer from './game/game_session'
import CreateGameSessionContainer from './game/create_game_session.js'

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

    this.sockets = [];

    this.createSocket = this.createSocket.bind(this);
    this.connectSocket = this.connectSocket.bind(this);
    this.joinSocket = this.joinSocket.bind(this);
  }

  joinSocket(room) {
    this.room = room;

    if (this.sockets.length > 0) {
      this.sockets.forEach((socket, idx) => {
        socket.off('change color');
        socket.off('receive gameState');
        socket.off('room change');
        socket.disconnect();
      })
      this.sockets = [];
    }

    let socket;
    if (process.env.NODE_ENV === 'development') {
      socket = socketIOClient('localhost:5000', { query: { room: this.room } });
    } else {
      socket = socketIOClient(window.location, { query: { room: this.room } });
    }
    this.sockets.push(socket);

    socket.on('change color', (col) => {
      document.body.style.backgroundColor = col;
    });
    socket.on('receive gameState', (receivedState) => {
      // console.log(this.room);
      console.log(socket.id);
      this.setState({ gameState: receivedState })
    });
    socket.on('room change', (newRoom) => {
      console.log(newRoom);
    });
    // socket.on('connect', () => {
    //   console.log(socket);
    // })

    if (process.env.NODE_ENV === 'development') {
      socket = socketIOClient('localhost:5000', { query: { room: this.room } });
    } else {
      socket = socketIOClient(window.location, { query: { room: this.room } });
    }
    this.sockets.push(socket);
    this.emit = emitSetup(socket);
    this.on = onSetup(socket);
  }
  
  createSocket() {
    this.joinSocket(this.getState().session.user.id);
  }
  
  connectSocket(username) {
    this.joinSocket('newroom');

    // setInterval(this.send, 1000);`
  }

  send() {
    // this.emit('change color', this.state.color);
    this.emit('set gameState', this.state.gameState);
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
      <div className="app">
        <button onClick={this.createSocket}>Create</button>
        <br></br>
        <button onClick={this.connectSocket}>Connect</button>
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

          <ProtectedRoute exact path="/game" component={JoinGameSessionContainer} />
          <ProtectedRoute exact path="/creategame" render={<CreateGameSessionContainer createSocket={this.createSocket} connectSocket={this.connectSocket}/>} />
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