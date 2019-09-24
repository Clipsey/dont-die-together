import React from 'react';
import { Game } from './logic';

class Test extends React.Component {
    constructor(props) {
        super(props);
        this.game = new Game();

        this.handleInput = this.handleInput.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);

        this.inputs = [false, false, false, false, false];
        this.state = {
            gameState: this.game.state
        };
    }

    componentDidMount(){
        setInterval(() => {
            let newGameState = this.game.update(30, this.inputs);
            this.setState({
                gameState: newGameState
            });
        }, 30);
    }

    handleKeyUp(e) {
        if (e.keyCode === 65) {
            this.inputs[0] = false;
        }
        if (e.keyCode === 68) {
            this.inputs[1] = false;
        }
        if (e.keyCode === 87) {
            this.inputs[2] = false;
        }
        if (e.keyCode === 83) {
            this.inputs[3] = false;
        }
    }

    handleInput(e) {
        console.log(this.state.gameState);
        if (e.keyCode === 65) {
            this.inputs[0] = true;
        }
        if (e.keyCode === 68) {
            this.inputs[1] = true;
        }
        if (e.keyCode === 87) {
            this.inputs[2] = true;
        }
        if (e.keyCode === 83) {
            this.inputs[3] = true;
        }
    }

    render() {
        return (
            <div>
                <div onKeyDown={this.handleInput}
                    onKeyUp={this.handleKeyUp}
                    tabIndex="0"
                    style={{
                    'position': 'fixed',
                    'left': '200px',
                    'top': '200px',
                    'width': '800px',
                    'height': '600px',
                    'background': 'black'
                }}
                >
                    <div style={{
                        'position': 'fixed',
                        'left': `${200 + this.state.gameState.player.position.x}px`,
                        'top': `${200 + this.state.gameState.player.position.y}px`,
                        'background': 'green',
                        'height': '15px',
                        'width': '15px'
                    }}>
                    </div>
                </div>
            </div>
        )
    }

}

export default Test;