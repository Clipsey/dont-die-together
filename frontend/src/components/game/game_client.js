import React from 'react';
import InputManager from './input_manager';
import Display from './display';
import Welcome from './welcome';
import GameModel from './logic/game_model';
import * as config from './config';
import '../../style/stylesheets/reset.css';
import '../../style/stylesheets/app.css';
import '../../style/stylesheets/game.css';
import * as config from './config';
const backgroundImg = require('../../style/images/forest.png');


class GameClient extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            input: new InputManager(),
            screen: {
                width: config.screenWidth,
                height: config.screenHeight,
            },
            context: null,
            display: null,
        };
        this.ownGameModel = null;
        this.lastTime = Date.now();
        this.gameState = config.emptyState;
        this.status = '';
        this.rafId = null;
        this.inputs = null;
    }

    SOCKET_ReceiveGameState(data) {
        if (!this.ownGameModel) {
            this.ownGameModel = new GameModel(data.gameState);
        }
        this.gameState = data.gameState;
        this.ownGameModel.replaceGameState(this.gameState);
        this.inputs = data.inputs;
    }

    componentDidMount() {
        let initialState = config.emptyState;
        this.state.input.bindKeys();
        const context = this.refs.canvas.getContext('2d');
        const display = new Display(context);
        initialState.players[this.props.name] = JSON.parse(JSON.stringify(config.newPlayer));
        initialState.players[this.props.name].name = this.props.name;
        this.numPlayers++;
        this.lastGameState = initialState;
        const model = new GameModel(initialState);
        this.setState({ 
            context: context,
            display: display
        }, () => this.mainLoop());
    }

    componentWillUnmount() {
        this.state.input.unbindKeys();
        cancelAnimationFrame(this.rafId);
    }
    
    mainLoop() {
        const now = Date.now();
        const dt = (now - this.lastTime) / 1000;
        this.state.display.draw(this.gameState, dt, this.props.name);
        let clientKeys = {};
        clientKeys.name = this.props.name
        clientKeys.inputs = this.state.input.pressedKeys;
        if(Object.keys(this.gameState.players).includes(this.props.name)) {
            clientKeys.inputs.pointX = this.state.input.mousePos.x - this.gameState.players[this.props.name].pos.x;
            clientKeys.inputs.pointY = this.state.input.mousePos.y - this.gameState.players[this.props.name].pos.y;
        }       
        this.props.send(clientKeys);
        this.lastTime = now;
        if (this.ownGameModel) this.gameState = this.ownGameModel.update(this.inputs, dt);
        this.rafId = requestAnimationFrame(() => this.mainLoop());
    }

    render() {
        const style = {
            cursor: 'crosshair',
            backgroundImage: `url(${backgroundImg})`
        };
        return (
            <div>
                <ul className="self-data">
                    <li id="score"></li>
                    <li id="current-gun"></li>
                    <li id="ammo"></li>
                </ul>  
                <canvas ref="canvas"
                    id="canvas"
                    width={this.state.screen.width}
                    height={this.state.screen.height}
                    style={style}
                />
            </div>
        )
    }
}

export default GameClient;