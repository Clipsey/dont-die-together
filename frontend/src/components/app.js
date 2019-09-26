import React from 'react';
import { AuthRoute, ProtectedRoute } from '../util/route_util';
import { Switch, Link, Route } from 'react-router-dom';
import NavBarContainer from './nav/navbar_container';
import TweetsContainer from './tweets/tweets_container';
import MainPage from './main/main_page';
import LoginFormContainer from './session/login_form_container';
import SignupFormContainer from './session/signup_form_container';
import ProfileContainer from './profile/profile_container';
import TweetComposeContainer from './tweets/tweet_compose_container';
import Game from './game/game';
import GameClient from './game/game_client';
import Modal from './modal/modal';
import JoinGameSessionContainer from './game/join_game_session_container'
import CreateGameSessionContainer from './game/create_game_session_container.js'
import GameSessionContainer from './game/game_session_container.js'
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
    this.setHealth = this.setHealth.bind(this);

    this.sockets = [];
    this.host = null;

    this.createSocket = this.createSocket.bind(this);
    this.connectSocket = this.connectSocket.bind(this);
    this.joinSocket = this.joinSocket.bind(this);
  }

  joinSocket(room) {
    this.room = room;

    if (this.sockets.length > 0) {
      this.sockets.forEach((socket, idx) => {
        socket.off('From Client Input');
        socket.off('From Host GameState');
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


    if (this.isHost) {
      socket.on('From Client Input', (receivedInput) => {
        console.log('From Client Input');
        this.setState({ gameState: receivedInput })
      });
    } else {
      console.log('attached to from host game state')
      socket.on('From Host GameState', (receivedGameState) => {
        console.log('From Host GameState');
        console.log(receivedGameState);
        console.log('receivingState');
        this.child.SOCKET_ReceiveGameState(receivedGameState);
      });
    }


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
    this.isHost = true;
    this.joinSocket(this.props.currentUser.id)
    // this.forceUpdate();
  }
  
  connectSocket(name) {
    console.log('connecting socket');
    this.isHost = false;
    const sessionId = this.props.users[name]._id;
    console.log(`Session ID: ${sessionId}`);
    this.joinSocket(sessionId);
    // this.forceUpdate();
  }

  send(data) {
    // this.child.testMethod();
    if (this.isHost) {
      this.emit('From Host GameState', data);
    } else {
      this.emit('From Client Input', this.state.gameState);
    }
  }

  setHealth(health) {
    return () => {
      const gameState = this.state.gameState;
      gameState['player']['health'] = health;
      return () => this.setState({ gameState });
    }
  }

  render() {
    console.log(`host: ${this.isHost}`);
    return (
      <div className="app">
          <div> DEBUGGER
            <br></br>
            <button onClick={this.createSocket}>Create</button>
            <br></br>
            <br></br>
            <button onClick={this.send}>Click</button>
            <br></br>
            <button onClick={this.setHealth(100)}>Health = 100</button>
            <br></br>
            <button onClick={this.setHealth(50)}>Health = 50</button>
            <div>{this.state.gameState.player.health}</div>
          </div>
  
        <NavBarContainer />
        <Switch>
          <AuthRoute exact path="/" component={MainPage} />
          <AuthRoute exact path="/login" component={LoginFormContainer} />
          <AuthRoute exact path="/signup" component={SignupFormContainer} />

          <ProtectedRoute exact path="/joingame" createSocket={this.createSocket} connectSocket={this.connectSocket} component={JoinGameSessionContainer} />
          <ProtectedRoute exact path="/creategame" createSocket={this.createSocket} connectSocket={this.connectSocket} component={CreateGameSessionContainer} />

          <ProtectedRoute path="/game" component={GameSessionContainer}>
            {this.isHost && this.props.loggedIn && <Route path='/game' render={() => <Game ref={Ref => this.child = Ref} send={this.send} isHost={this.isHost} />} /> } 
            
            {!this.isHost && this.props.loggedIn && <Route path='/game' render={() => <GameClient ref={Ref => this.child = Ref} send={this.send} isHost={this.isHost} />} /> }
          </ProtectedRoute>
        </Switch>
      </div>
    )
  }
};

export default App;