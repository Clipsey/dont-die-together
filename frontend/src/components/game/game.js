import React from 'react';
import InputManager from './input_manager';
import Welcome from './welcome';
import GameModel from './logic/game_model';
const playerImg = require('../../style/images/bk_player_assets/player_chaingun.png');
const zombieImg = require('../../style/images/bk_player_assets/player_9mmhandgun.png');

const initialState = {
    players: {
        1: {
            pos: {
                x: 100,
                y: 100
            },
            health: 100
        },
        2: {
            pos: {
                x: 200,
                y: 100
            },
            health: 50
        }
    }
};

const canvasStyle = {
    display: 'block',
    backgroundColor: '#A9A9A9',
    marginLeft: 'auto',
    marginRight: 'auto'
};
const GameMode = {
    StartScreen: 0,
    Playing: 1,
    GameOver: 2
};
const screenWidth = 800;
const screenHeight = 600;

class Game extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            input: new InputManager(),
            screen: {
                width: screenWidth,
                height: screenHeight,
            },
        
            gameMode: GameMode.StartScreen,
            context: null
        };
        this.lastTime = Date.now();
        this.GameModel = new GameModel();
        this.frames = 0;
        this.fps = 0;
        this.lastGameState = initialState;
    }

    calcAngle(player) {
        let mouseX = this.state.input.mousePos.x;
        let mouseY = this.state.input.mousePos.y;
        let dX = mouseX - player.pos.x;
        let dY = mouseY - player.pos.y;

        let radians = Math.atan(dY/dX);
        let degrees = radians * 180 / Math.PI;
        return degrees;
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

    clearScreen() {
        const ctx = this.state.context;
        ctx.save();
        ctx.fillStyle = canvasStyle.backgroundColor;
        ctx.fillRect(0, 0, this.state.screen.width, this.state.screen.height);
    }

    display(gameState, dt) {
        this.clearScreen();
        this.displayPlayers(gameState);
        this.displayEnemies(gameState);
        this.displayFPS(dt, gameState)
    }

    displayFPS(dt, gameState) {
        this.frames++;
        if (this.frames === 60) {
            this.fps = (1/dt).toFixed(1);
            this.frames = 0
        }
        const ctx = this.state.context;
        ctx.fillFont = 'bold 10px serif';
        ctx.strokeText(`FPS: ${this.fps}`, 20, 20);
    }

    displayEnemies(gameState) {
        let enemies = Object.values(gameState.enemies);
        for (let i = 0; i < enemies.length; i++) {
            this.displayEnemy(enemies[i]);
        }
    }

    displayEnemy(enemy) {
        const ctx = this.state.context;
        let img = new Image();
        img.src = zombieImg;

        ctx.save();

        // ctx.drawImage(img, enemy.pos.x, enemy.pos.y);

        ctx.translate(enemy.pos.x, enemy.pos.y);
        ctx.strokeStyle = '#ccccfc';
        ctx.fillStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, 12, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.restore();
    }

    displayPlayer(player) {
        const ctx = this.state.context;
        let img = new Image();
        img.src = playerImg;

        ctx.save();
        // ctx.drawImage(img, player.pos.x, player.pos.y);
        // ctx.save();
        // ctx.translate(player.pos.x, player.pos.y);
        ctx.strokeStyle = '#ffffff';
        ctx.fillStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(player.pos.x, player.pos.y, 12, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.restore();
    }

    displayPlayers(gameState) {
        let players = Object.values(gameState.players);
        for (let i = 0; i < players.length; i++) {
            this.displayPlayer(players[i]);
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

        const myKeyPresses = this.state.input.pressedKeys;
        if (myKeyPresses.fire === true) {
            console.log('bang');
        }
        let mousePos = this.state.input.getMousePos;
        let x = mousePos.x;
        let y = mousePos.y;
        myKeyPresses.pointX = x - this.lastGameState.players[1].pos.x;
        myKeyPresses.pointY = y - this.lastGameState.players[1].pos.y;
        

        let _nullKeyPresses = { left: false, right: false, up: false, down: false, fire: false, enter: false, pointX: 1, pointY: 1};
        let inputs = {
            1: myKeyPresses,
            2: _nullKeyPresses,
        };
        if (this.state.gameMode === GameMode.StartScreen && myKeyPresses.enter) {
            this.startGame();
        }

        if (this.state.gameMode === GameMode.Playing) {
            let nextState = this.GameModel.update(inputs, dt);
            this.display(nextState, dt);
            this.lastGameState = nextState;
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
                    style={canvasStyle}
                />
            </div>
        );
    }
}

export default Game;