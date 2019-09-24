const CONFIG = {
    playerSpeed: 800,
}

class GameLogic {
    constructor(args){
        this.gameState = {
            players: {
                1: {
                    pos: {
                        x: 100,
                        y: 100
                    }
                }
            }
        }
    }

    update(inputs, dt) {
        if (inputs[1].right) {
            this.gameState.players[1].pos.x += CONFIG.playerSpeed * dt;
        }
        if (inputs[1].left) {
         this.gameState.players[1].pos.x -= CONFIG.playerSpeed * dt;
        }
        return this.gameState;
    }
}

export default GameLogic;