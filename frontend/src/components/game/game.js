import React from 'react';
import InputManager from './input_manager';
import Welcome from './welcome';
import Player from './player';

const canvasStyle = {
    display: 'block',
    backgroundColor: '#000000',
    marginLeft: 'auto',
    marginRight: 'auto'
};

const GameState = {
    StartScreen : 0,
    Playing : 1,
    GameOver : 2
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
        
            gameState: GameState.StartScreen,
            context: null
        };

        this.player = null;
    }

    componentDidMount() {
        this.state.input.bindKeys();
        const context = this.refs.canvas.getContext('2d');
        this.setState({ context: context })
        requestAnimationFrame(() => this.update());
    }

    componentWillUnmount() {
        this.state.input.unbindKeys();
    }

    startGame() {
        let player = new Player({
            speed: 1,
            position: {
                x: 100,
                y: 100
            }
        });

        this.player = player;
        this.setState({
            gameState: GameState.Playing
        });
    }

    update() {
        const keys = this.state.input.pressedKeys;
        if (this.state.gameState === GameState.StartScreen && keys.enter) {
            this.startGame();
        }

        if (this.state.gameState === GameState.Playing) {
            let ctx = this.state.context;
            ctx.save();
            ctx.fillRect(0, 0, this.state.screen.width, this.state.screen.height);
            if (this.player !== undefined && this.player !== null) {
                this.player.update(keys);
                this.player.render(this.state);
            }
        }

        requestAnimationFrame(() => this.update());
    }

    render() {
        return (
            <div>
                {this.state.gameState === GameState.StartScreen && <Welcome />}
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