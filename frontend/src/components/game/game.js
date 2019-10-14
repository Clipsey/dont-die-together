import React from 'react';
import InputManager from './input_manager';
import GameModel from './logic/game_model';
import '../../style/stylesheets/reset.css';
import '../../style/stylesheets/app.css';
import '../../style/stylesheets/game.css';
import * as config from './config';
import Display from './display';
const backgroundImg = require('../../style/images/forest.png');

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.display = null;
        this.input = new InputManager();
        this.gameModel = new GameModel(config.emptyState);
        this.lastTime = Date.now();
        this.gameState = null;
        this.otherInputs = [];
        this.rafId = null;
        this.numPlayers = 0;
    }

    SOCKET_ReceiveInputs(inputs) {
        if (!Object.keys(this.gameState.players).includes(inputs.name)) this.addPlayer(inputs);
        this.otherInputs.push(inputs);
    }

    SOCKET_ReceiveInitialState(gameState) {
        
    }

    addPlayer(inputs) {        
        let newPlayer = JSON.parse(JSON.stringify(config.newPlayer));
        this.gameState.players[inputs.name] = newPlayer;
        this.gameModel.replaceGameState(this.gameState);
    }

    collectInputs() {
        let collected = {};
        this.otherInputs.forEach(input => collected[input.name] = input.inputs);
        return collected;
    }

    componentDidMount() {
        const initialState = config.emptyState
        const canvas = document.getElementById('canvas');
        const context = canvas.getContext('2d');
        this.input.bindKeys();
        this.display = new Display(context);
        initialState.players[this.props.name] = JSON.parse(JSON.stringify(config.newPlayer));
        initialState.players[this.props.name].name = this.props.name;
        this.numPlayers++;
        this.gameState = initialState;
        this.mainLoop();
    }

    componentWillUnmount() {
        this.input.unbindKeys();
        cancelAnimationFrame(this.rafId);
    }

    mainLoop() {
        const now = Date.now();
        const dt = (now - this.lastTime) / 1000;
        const hostKeys = this.input.pressedKeys;
        const collectedInputs = this.collectInputs();
        hostKeys.pointX = this.input.mousePos.x - this.gameState.players[this.props.name].pos.x;
        hostKeys.pointY = this.input.mousePos.y - this.gameState.players[this.props.name].pos.y;
        hostKeys.name = this.props.name;
        collectedInputs[this.props.name] = hostKeys;
        this.gameState = this.gameModel.update(collectedInputs, dt);
        this.props.send({
            gameState: this.gameState,
            inputs: collectedInputs
        });
        this.display.draw(this.gameState, dt, this.props.name);
        this.lastTime = now;
        this.rafId = requestAnimationFrame(() => this.mainLoop());
    }

    render() {
        const style = {
            cursor: 'crosshair',
            backgroundImage: `url(${backgroundImg})`
        };
        return (
            <div className='game-window'>               
                <ul className="self-data">
                    <li id="score"></li>
                    <li id="current-gun"></li>
                    <li id="ammo"></li>
                </ul>               
                <canvas ref="canvas"
                    id="canvas"
                    width={config.screenWidth}
                    height={config.screenHeight}
                    style={style}
                />
            </div>
        );
    }
}
export default Game;