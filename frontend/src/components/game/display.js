import * as MainConfig from './config';
import gameConfig from './logic/config';

class Display {
    constructor(ctx) {
        this.ctx = ctx;
        this.mode = process.env.NODE_ENV;
    }

    clearScreen(){
        this.ctx.save();
        this.ctx.fillStyle = MainConfig.canvasStyle.backgroundColor;
        this.ctx.fillRect(0, 0, MainConfig.screenWidth, MainConfig.screenHeight);
    };

    draw(gameState, dt) {
        this.clearScreen();
        this.displayPlayers(gameState);
        this.displayEnemies(gameState);
        this.displayBullets(gameState);
        this.displayItems(gameState);
        if (this.mode === 'development') {
            this.displayFPS(dt);
        }
    }

    displayBullet(bullet) {
        this.ctx.save();
        this.ctx.translate(bullet.pos.x, bullet.pos.y);
        this.ctx.strokeStyle = '#4a200d';
        this.ctx.fillStyle = '#4a200d';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.arc(0, 0, gameConfig.sizes.bullets, 0, 2 * Math.PI);
        this.ctx.stroke();
        this.ctx.restore();
    }

    displayBullets(gameState) {
        let bullets = Object.values(gameState.bullets);
        for (let i = 0; i < bullets.length; i++) {
            this.displayBullet(bullets[i], this.ctx);
        }
    }

    displayEnemies(gameState) {
        let enemies = Object.values(gameState.enemies);
        for (let i = 0; i < enemies.length; i++) {
            this.displayEnemy(enemies[i]);
        }
    }

    displayFPS(dt) {
        let fps = (1/dt).toFixed(1);   
        this.ctx.fillFont = 'bold 10px serif';
        this.ctx.strokeText(`FPS: ${fps}`, 20, 20);
    }

    displayItem(item) {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.lineWidth = "6";
        this.ctx.strokeStyle = "red";
        this.ctx.rect(item.pos.x - 2.5, item.pos.y - 2.5, 5, 5)
        this.ctx.stroke();
        this.ctx.restore();
    }

    displayItems(gameState) {
        const items = Object.values(gameState.items);
        for (let i = 0; i < items.length; i++) {
            this.displayItem(items[i]);
        }
    }

    displayPlayers(gameState) {
        let players = Object.values(gameState.players);
        for (let i = 0; i < players.length; i++) {
            this.displayPlayer(players[i]);
        }
    }
    
    displayPlayer (player) {
        this.ctx.save();

        this.ctx.fillFont = 'bold 10px serif';
        this.ctx.strokeText(`Health: ${player.health}`, player.pos.x - 10, player.pos.y - 32);
        this.ctx.strokeText(`Gun: ${player.weapon}`, player.pos.x - 10, player.pos.y - 22);
        this.ctx.strokeText(`Ammo: ${player.ammo}`, player.pos.x - 10, player.pos.y - 12);

        this.ctx.strokeStyle = '#234c70';
        this.ctx.fillStyle = '#234c70';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.arc(player.pos.x, player.pos.y, gameConfig.sizes.player, 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.stroke();
        this.ctx.restore();
    }
    
    displayEnemy(enemy) {
        this.ctx.save();
    
        this.ctx.fillFont = 'bold 10px serif';
        this.ctx.strokeText(`Health: ${enemy.health}`, enemy.pos.x - 10, enemy.pos.y-15);
    
        this.ctx.translate(enemy.pos.x, enemy.pos.y);
        this.ctx.strokeStyle = '#215910';
        this.ctx.fillStyle = '#215910';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.arc(0, 0, gameConfig.sizes.zombie, 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.stroke();
        this.ctx.restore();
    }
}

export default Display;