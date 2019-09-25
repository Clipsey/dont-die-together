import React from 'react';

import InputManager from './input_manager';
import Welcome from './welcome';
import GameModel from './logic/game_model';
import * as DisplayUtil from './display_util';
import * as DisplayConfig from './display_config';


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
            context: null
        };
        this.lastTime = Date.now();
        this.GameModel = new GameModel();
        this.frames = 0;
        this.fps = 0;
        this.gameState = DisplayConfig.initialState;
        this.displayPlayers = this.displayPlayers.bind(this);
    }

    calcRelMousePos(player) {

    }

    componentDidMount() {
        this.state.input.bindKeys();
        const context = this.refs.canvas.getContext('2d');
        this.setState({ 
            context: context 
        })
        requestAnimationFrame(() => this.mainLoop());
    }

    componentWillUnmount() {
        this.state.input.unbindKeys();
    }

    display(gameState, dt) {
        DisplayUtil.clearScreen(this.state.context);
        this.displayPlayers(gameState);
        this.displayEnemies(gameState);
        this.displayBullets(gameState);
        DisplayUtil.displayFPS(dt, this.state.context)
    }

    displayBullets(gameState) {
        let bullets = Object.values(gameState.bullets);
        for (let i = 0; i < bullets.length; i++) {
            DisplayUtil.displayBullet(bullets[i], this.state.context);
        }
    }

    displayEnemies(gameState) {
        let enemies = Object.values(gameState.enemies);
        for (let i = 0; i < enemies.length; i++) {
            DisplayUtil.displayEnemy(enemies[i], this.state.context);
        }
    }

    displayPlayers(gameState) {
        let players = Object.values(gameState.players);
        for (let i = 0; i < players.length; i++) {
            DisplayUtil.displayPlayer(players[i], this.state.context);
        }
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
            2: nullKeys,
        };

        if (this.state.gameMode === GameMode.StartScreen && hostKeys.enter) {
            this.startGame();
        }

        if (this.state.gameMode === GameMode.Playing) {
            this.gameState = this.GameModel.update(inputCollection, dt);
            this.display(this.gameState, dt);
        }
        this.lastTime = now;
        requestAnimationFrame(() => this.mainLoop());
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