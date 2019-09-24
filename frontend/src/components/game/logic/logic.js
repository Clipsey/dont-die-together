import gameConfig from '../config';

const sampleState = {
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
    },
    enemies: {
        zombies: {
            1: {
                pos: {
                    x: 150,
                    y: 300
                },
                health: 100
            },
            2: {
                pos: {
                    x: 20,
                    y: 450
                },
                health: 100
            }
        }
    }
};

export class Game {
    constructor(initialState = sampleState) {
        this.state = initialState;
        this.speeds = gameConfig.speeds;
    }

    update(inputs, dt) { 
        this.movePlayers(inputs, dt);
        return this.state;
    }

    movePlayer(inputs, dt) {
        let dist = dt*this.speeds.player;
        this.state.players.each( (player) => {
            let playerInputs = inputs[player];
            if (playerInputs[up]) {
                this.state.players[player].y -= dist;
            }
            if (playerInputs[down]) {
                this.state.players[player].y += dist;
            }
            if (playerInputs[right]) {
                this.state.players[player].x += dist;
            }
            if (playerInputs[left]) {
                this.state.players[player].x -= dist;
            }
        });
    }
}
