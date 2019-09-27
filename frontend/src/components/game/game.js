import React from 'react';

import InputManager from './input_manager';
import Welcome from './welcome';
import GameModel from './logic/game_model';
import '../../style/stylesheets/reset.css';
import '../../style/stylesheets/app.css';
import '../../style/stylesheets/game.css';
import * as DisplayConfig from './main_config';
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
                width: DisplayConfig.screenWidth,
                height: DisplayConfig.screenHeight,
            },
            gameMode: GameMode.StartScreen,
            context: null,
            display: null,
            gameModel: null,
        };
        this.lastTime = Date.now();
        this.lastGameState = null;
        this.status = '';
        this.otherInputs = nullKeys;
        this.rafId = null;
    }

    SOCKET_ReceiveInputs(inputs) {
        this.otherInputs = inputs;
    }

    SOCKET_ReceiveInitialState(gameState) {
        
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

    startGame(initialState = DisplayConfig.emptyState) {
        initialState.players[this.props.name] = DisplayConfig.newPlayer;
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
        if (this.state.gameMode === GameMode.StartScreen && hostKeys.enter) {
            this.startGame();
        }
        const inputCollection = {};

        if (this.state.gameMode === GameMode.Playing) {            
            inputCollection[this.props.name] = hostKeys;
            hostKeys.pointX = this.state.input.mousePos.x - this.lastGameState.players[this.props.name].pos.x;
            hostKeys.pointY = this.state.input.mousePos.y - this.lastGameState.players[this.props.name].pos.y;
            this.lastGameState = this.state.gameModel.update(inputCollection, dt);
            this.state.display.draw(this.lastGameState, dt);
        }
        this.lastTime = now;
        this.rafId = requestAnimationFrame(() => this.mainLoop());
        this.props.send(this.gameState);
    }

    render() {
        return (
            <div>
                {this.state.gameMode === GameMode.StartScreen && <Welcome />}
                <canvas ref="canvas"
                    id="canvas"
                    width={this.state.screen.width}
                    height={this.state.screen.height}
                    style={DisplayConfig.canvasStyle}
                />
            </div>
        );
    }
}

export default Game;