import React from 'react';
import InputManager from './input_manager';
import Welcome from './welcome';
import GameModel from './logic/game_model';
import '../../style/stylesheets/reset.css';
import '../../style/stylesheets/app.css';
import '../../style/stylesheets/game.css';

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

const width = 640;
const height = 480;

class Game extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            input: new InputManager(),
            screen: {
                width: width,
                height: height,
            },
        
            gameMode: GameMode.StartScreen,
            context: null
        };
        this.lastTime = Date.now();
        this.GameModel = new GameModel();
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

    display(gameState) {
        this.clearScreen();
        this.displayPlayers(gameState);
        this.displayEnemies(gameState);
    }

    displayEnemies(gameState) {
        let enemies = Object.values(gameState.enemies);
        for (let i = 0; i < enemies.length; i++) {
            this.displayEnemy(enemies[i]);
        }
    }

    displayEnemy(enemy) {
        const ctx = this.state.context;
        ctx.save();
        ctx.translate(enemy.pos.x, enemy.pos.y);
        ctx.strokeStyle = '#ccccfc';
        ctx.fillStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(100, 75, 12, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.restore();
    }

    displayPlayer(player) {
        const ctx = this.state.context;
        ctx.save();
        ctx.translate(player.pos.x, player.pos.y);
        ctx.strokeStyle = '#ffffff';
        ctx.fillStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(100, 75, 12, 0, 2 * Math.PI);
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
        const keys = this.state.input.pressedKeys;
        let inputs = {
            1: keys,
            2: { left: false, right: false, up: false, down: false, fire: false, enter: false },
        };
        if (this.state.gameMode === GameMode.StartScreen && keys.enter) {
            this.startGame();
        }

        if (this.state.gameMode === GameMode.Playing) {
            let nextState = this.GameModel.update(inputs, dt);
            this.display(nextState);
        }
        this.lastTime = now;
        requestAnimationFrame(() => this.mainLoop());
    }

    render() {
        return (
            <div>
                {this.state.gameMode === GameMode.StartScreen && <Welcome />}
                <canvas ref="canvas"
                    width={this.state.screen.width}
                    height={this.state.screen.height}
                    style={canvasStyle}
                />
            </div>
        );
    }
}

export default Game;