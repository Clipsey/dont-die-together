import React from 'react';

import InputManager from './input_manager';
import Welcome from './welcome';
import GameModel from './logic/game_model';
import '../../style/stylesheets/reset.css';
import '../../style/stylesheets/app.css';
import '../../style/stylesheets/game.css';
import * as DisplayConfig from './display_config';
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
            gameModel: new GameModel()
        };
        this.lastTime = Date.now();
        this.gameState = DisplayConfig.initialState;
        this.status = '';
        this.otherInputs = nullKeys;
    }

    SOCKET_ReceiveInputs(inputs) {
        this.otherInputs = inputs;
    }

    componentDidMount() {
        this.state.input.bindKeys();
        const context = this.refs.canvas.getContext('2d');
        const display = new Display(context);
        this.setState({ 
            context: context,
            display: display
        })
        requestAnimationFrame(() => this.mainLoop());
    }

    componentWillUnmount() {
        this.state.input.unbindKeys();
    }

    startGame() {
        this.setState({
            gameMode: GameMode.Playing
        });
    }

    mainLoop() {
        let now = Date.now();
        let dt = (now - this.lastTime) / 1000;

        const hostKeys = this.state.input.pressedKeys;
        hostKeys.pointX = this.state.input.mousePos.x - this.gameState.players[1].pos.x;
        hostKeys.pointY = this.state.input.mousePos.y - this.gameState.players[1].pos.y;

        const inputCollection = {
            1: hostKeys,
            2: this.otherInputs,
        };

        if (this.state.gameMode === GameMode.StartScreen && hostKeys.enter) {
            this.startGame();
        }

        if (this.state.gameMode === GameMode.Playing) {
            this.gameState = this.state.gameModel.update(inputCollection, dt);
            this.state.display.draw(this.gameState, dt);
        }
        this.lastTime = now;
        requestAnimationFrame(() => this.mainLoop());
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