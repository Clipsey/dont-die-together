const CONFIG = {
    playerSpeed: 800,
}

class GameLogic {
    constructor(args){
        this.gameState = {
            player: {
                x: 100,
                y: 100
            }
        }
    }

    update(keys, dt) {
        if (keys.right) {
            this.gameState.player.x += CONFIG.playerSpeed * dt;
        }
        if (keys.left) {
         this.gameState.player.x -= CONFIG.playerSpeed * dt;
        }
        if (keys.up) {
            this.gameState.player.y -= CONFIG.playerSpeed * dt;
        }
        if (keys.down) {
            this.gameState.player.y += CONFIG.playerSpeed * dt;
        }
        return this.gameState;
    }
}

export default GameLogic;