import React from 'react';
import InputManager from './input_manager';
import Welcome from './welcome';
import GameModel from './logic/game_model';
import '../../style/stylesheets/reset.css';
import '../../style/stylesheets/app.css';
import '../../style/stylesheets/game.css';
import * as config from './config';
import Display from './display';
const backgroundImg = require('../../style/images/forest.png');

const GameMode = {
    StartScreen: 0,
    Playing: 1,
    GameOver: 2
};

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.input = new InputManager();
        this.state = {
            gameMode: GameMode.StartScreen,
            context: null,
            gameModel: null,
            display: null
        };
        this.lastTime = Date.now();
        this.gameState = null;
        this.status = '';
        this.otherInputs = [];
        this.rafId = null;
        this.numPlayers = 0;
        this.lastUpdate = Date.now();
        this.loggedYet = false;
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
        this.state.gameModel.replaceGameState(this.gameState, this.props.name);
    }

    collectInputs() {
        let collected = {};
        this.otherInputs.forEach(input => collected[input.name] = input.inputs);
        return collected;
    }

    componentDidMount() {
        this.input.bindKeys();
        const context = this.refs.canvas.getContext('2d');
        const display = new Display(context);
        this.setState({ 
            context: context,
            display: display
        })
        this.mainLoop();
    }

    componentWillUnmount() {
        this.input.unbindKeys();
        cancelAnimationFrame(this.rafId);
    }

    startGame(initialState = config.emptyState) {
        initialState.players[this.props.name] = JSON.parse(JSON.stringify(config.newPlayer));
        initialState.players[this.props.name].name = this.props.name;
        this.numPlayers++;
        this.gameState = initialState;
        const model = new GameModel(initialState);
        this.setState({
            gameMode: GameMode.Playing,
            gameModel: model
        });
    }

    mainLoop() {
        const now = Date.now();
        const dt = (now - this.lastTime) / 1000;
        const hostKeys = this.input.pressedKeys;
        if (this.state.gameMode === GameMode.StartScreen && hostKeys.enter) this.startGame();
        if (this.state.gameMode === GameMode.Playing) {        
            let collectedInputs = this.collectInputs();
            hostKeys.pointX = this.input.mousePos.x - this.gameState.players[this.props.name].pos.x;
            hostKeys.pointY = this.input.mousePos.y - this.gameState.players[this.props.name].pos.y;
            hostKeys.name = this.props.name;
            collectedInputs[this.props.name] = hostKeys;
            this.gameState = this.state.gameModel.update(collectedInputs, dt, this.props.name);
            this.props.send({
                gameState: this.gameState,
                inputs: collectedInputs
            });
            this.state.display.draw(this.gameState, dt, this.props.name);
        }
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
                {this.state.gameMode === GameMode.StartScreen && <Welcome />}
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