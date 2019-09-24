const CONFIG = {
    playerSpeed: 1,
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

    update(keys) {
        if (keys.right) {
            this.gameState.player.x += CONFIG.playerSpeed;
        } else if (keys.left) {
         this.gameState.player.x -= CONFIG.playerSpeed;
        } else if (keys.up) {
            this.gameState.player.y -= CONFIG.playerSpeed;
        } else if (keys.down) {
            this.gameState.player.y += CONFIG.playerSpeed;
        }
        return this.gameState;
    }
}

export default GameLogic;