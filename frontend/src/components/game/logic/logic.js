import gameConfig from '../config';

export const test = () => {
    return 'this is the game logic';
}

const sample = {
    player: {
        position: [50, 50]
    }
};

export class Game {
    constructor(initialState = sample) {
        this.state = initialState;
        this.speeds = gameConfig.speeds;
    }

    update(dt, inputs) {   //inputs, e.g. ['left', 'fire']
        this.movePlayer(dt, inputs);
        return this.state;
    }

    movePlayer(dt, inputs) {
        let dist = dt*this.speeds.player/1000;
        if (inputs.includes('left')){
            this.state.player.position[1] -= dist;
        }
        if (inputs.includes('right')){
            this.state.player.position[1] += dist;
        }
        if (inputs.includes('up')){
            this.state.player.position[0] -= dist;
        }
        if (inputs.includes('down')){
            this.state.player.position[0] += dist;
        }
    }
}

export const update = (dt, inputs) => {

}