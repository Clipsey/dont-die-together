import React from 'react';

import InputManager from './input_manager';
import Welcome from './welcome';
import GameModel from './logic/game_model';
import '../../style/stylesheets/reset.css';
import '../../style/stylesheets/app.css';
import '../../style/stylesheets/game.css';
import * as MainConfig from './config';
import Display from './display';

const GameMode = {
    StartScreen: 0,
    Playing: 1,
    GameOver: 2
};

const nullKeys = { left: false, right: false, up: false, down: false, fire: false, enter: false, pointX: 1, pointY: 1};

class Game extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            input: new InputManager(),
            screen: {
                width: MainConfig.screenWidth,
                height: MainConfig.screenHeight,
            },
            gameMode: GameMode.StartScreen,
            context: null,
            display: null,
            gameModel: null,
        };
        this.lastTime = Date.now();
        this.lastGameState = null;
        this.status = '';
        this.otherInputs = [];
        this.rafId = null;
        this.numPlayers = 0;
        this.lastUpdate = Date.now();
    }

    SOCKET_ReceiveInputs(inputs) {
        if (!Object.keys(this.lastGameState.players).includes(inputs.name)) {
            this.addPlayer(inputs);
        }
        this.otherInputs.push(inputs);
    }

    SOCKET_ReceiveInitialState(gameState) {
        
    }

    addPlayer(inputs) {        
        let newPlayer = JSON.parse(JSON.stringify(MainConfig.newPlayer));
        this.lastGameState.players[inputs.name] = newPlayer;
        this.state.gameModel.replaceGameState(this.lastGameState);
    }

    collectInputs() {
        let collected = {};
        this.otherInputs.forEach(input => {
            collected[input.name] = input.inputs;
        });
        return collected;
    }

    componentDidMount() {
        this.state.input.bindKeys();
        const context = this.refs.canvas.getContext('2d');
        const display = new Display(context);
        this.setState({ 
            context: context,
            display: display
        })
        this.mainLoop();
    }

    componentWillUnmount() {
        this.state.input.unbindKeys();
        cancelAnimationFrame(this.rafId);
    }

    startGame(initialState = MainConfig.emptyState) {
        initialState.players[this.props.name] = JSON.parse(JSON.stringify(MainConfig.newPlayer));
        initialState.players[this.props.name].name = this.props.name;
        this.numPlayers++;
        this.lastGameState = initialState;
        const model = new GameModel(initialState);
        this.setState({
            gameMode: GameMode.Playing,
            gameModel: model
        });
    }

    mainLoop() {
        const now = Date.now();
        const dt = (now - this.lastTime) / 1000;
        const hostKeys = this.state.input.pressedKeys;

        if (this.state.gameMode === GameMode.StartScreen && hostKeys.enter) this.startGame();

        if (this.state.gameMode === GameMode.Playing) {            
            hostKeys.pointX = this.state.input.mousePos.x - this.lastGameState.players[this.props.name].pos.x;
            hostKeys.pointY = this.state.input.mousePos.y - this.lastGameState.players[this.props.name].pos.y;
            hostKeys.name = this.props.name;
            let collectedInputs = this.collectInputs();
            collectedInputs[this.props.name] = hostKeys;
            this.lastGameState = this.state.gameModel.update(collectedInputs, dt);

            this.state.display.draw(this.lastGameState, dt, this.props.name, collectedInputs);

            const data = {};
            data.gameState = this.lastGameState;
            data.inputs = collectedInputs;
            this.props.send(data);

            if (now - this.lastUpdate > 10000) {
                console.log(this.lastGameState);
                this.lastUpdate = now;
            }
        }
        this.lastTime = now;
        this.rafId = requestAnimationFrame(() => this.mainLoop());
    }

    render() {
        return (
            <div>
                {this.state.gameMode === GameMode.StartScreen && <Welcome />}
                <canvas ref="canvas"
                    id="canvas"
                    width={this.state.screen.width}
                    height={this.state.screen.height}
                    style={MainConfig.canvasStyle}
                />
            </div>
        );
    }
}

export default Game;