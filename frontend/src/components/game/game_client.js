import React from 'react';
import InputManager from './input_manager';
import Display from './display';
import Welcome from './welcome';
import GameModel from './logic/game_model';
import '../../style/stylesheets/reset.css';
import '../../style/stylesheets/app.css';
import '../../style/stylesheets/game.css';
import * as DisplayConfig from './display_config';

class GameClient extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            input: new InputManager(),
            screen: {
                width: DisplayConfig.screenWidth,
                height: DisplayConfig.screenHeight,
            },
            context: null,
            display: null,
        };
        this.lastTime = Date.now();
        this.gameState = DisplayConfig.initialState;
        this.status = '';
    }

    SOCKET_ReceiveGameState(gameState) {
        this.gameState = gameState;
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

    mainLoop() {
        this.state.display.draw(this.gameState);
        console.log('loop')
        requestAnimationFrame(() => this.mainLoop());
    }

    render() {
        return (
            <div>
                <canvas ref="canvas"
                    id="canvas"
                    width={this.state.screen.width}
                    height={this.state.screen.height}
                    style={DisplayConfig.canvasStyle}
                />
            </div>
        )
    }
}

export default GameClient;