import React from 'react';
import * as DisplayConfig from './display_config';
import * as DisplayUtil from './display_util';
import InputManager from './input_manager';

class GameClient extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            input: new InputManager(),
            screen: {
                width: DisplayConfig.screenWidth,
                height: DisplayConfig.screenHeight,
            },
            context: null
        };

        this.on = props.on;
        this.emit = props.emit;
        this.gameState = DisplayConfig.initialState;
    }

    componentDidMount() {
        this.state.input.bindKeys();
        const context = this.refs.canvas.getContext('2d');
        this.setState({ 
            context: context 
        })
    }

    componentWillUnmount() {
        this.state.input.unbindKeys();
    }

    display(gameState) {
        DisplayUtil.clearScreen(this.state.context);
        this.displayPlayers(gameState);
    }

    displayPlayers(gameState) {
        let players = Object.values(gameState.players);
        for (let i = 0; i < players.length; i++) {
            DisplayUtil.displayPlayer(players[i], this.state.context);
        }
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