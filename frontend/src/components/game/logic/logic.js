import gameConfig from '../config';

export const test = () => {
    return 'this is the game logic';
}

const sample = {
    player: {
        position: {
            x: 50,
            y: 50
        }
    }
};

export class Game {
    constructor(initialState = sample) {
        this.state = initialState;
        this.speeds = gameConfig.speeds;
    }

    update(dt, inputs) {   //inputs, e.g. [left, right, up, down, fire]
        this.movePlayer(dt, inputs);
        return this.state;
    }

    movePlayer(dt, inputs) {
        let dist = dt*this.speeds.player/1000;
        if (inputs[0]){
            this.state.player.position.x -= dist;
        }
        if (inputs[1]){
            this.state.player.position.x += dist;
        }
        if (inputs[2]){
            this.state.player.position.y -= dist;
        }
        if (inputs[3]){
            this.state.player.position.y += dist;
        }
    }
}

export const update = (dt, inputs) => {

}