import * as MainConfig from './config';
import logicConfig from './logic/config';
const playerRifle = require('../../style/images/bk_player_assets/player_chaingun.png');
const playerShotgun = require('../../style/images/bk_player_assets/player_pumpgun_stand.png');
const playerHandgun = require('../../style/images/bk_player_assets/player_9mmhandgun.png');
const zombieSprite = require('../../style/images/zombiebasic.png');

const medPack = require('../../style/images/MedPack.png');
const gunSprites = require('../../style/images/gun_sprites.png');
const ammo = require('../../style/images/ammo.png');

class Display {
    constructor(ctx) {
        this.ctx = ctx;
        this.mode = process.env.NODE_ENV;
    }

    clearScreen(){
        this.ctx.clearRect(0,0, MainConfig.screenWidth, MainConfig.screenHeight);
    };

    draw(gameState, dt, name) {
        this.clearScreen();
        Object.values(gameState.enemies).forEach(enemy => this.displayEnemy(enemy));
        Object.values(gameState.bullets).forEach(bullet => this.displayBullet(bullet));
        Object.values(gameState.items).forEach(item => this.displayItem(item));
        Object.values(gameState.players).forEach(player => this.displayPlayer(player));
        const selfData = gameState.players[name];
        if (selfData) this.displaySelfData(selfData);
        if (this.mode === 'development') this.displayFPS(dt);
    }

    displaySelfData(data) {
        const score = document.getElementById("score");
        const currentGun = document.getElementById("current-gun");
        const ammo = document.getElementById("ammo");
        score.innerHTML = `Score: ${data.killCount}`;
        ammo.innerHTML = `Ammo: ${data.ammo}`;
        currentGun.innerHTML = `Weapon: ${data.weapon}`;

        this.ctx.lineWidth = 3;
        this.ctx.strokeStyle = 'rgba(0,255,0,0.5)';
        this.ctx.beginPath();
        this.ctx.arc(data.pos.x, data.pos.y, 25, 0, Math.PI*2*data.health/100);
        this.ctx.stroke();
    }

    displayFPS(dt) {
        let fps = (1/dt).toFixed(1);   
        this.ctx.strokeText(`FPS: ${fps}`, 1120, 20);
    }

    displayBullet(bullet) {
        if (bullet.status === 'flash') {
            this.ctx.strokeStyle = '#4a200d';
            this.ctx.fillStyle = 'orange';
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.arc(bullet.pos.x, bullet.pos.y, logicConfig.sizes.bullets * 13, 0, 2 * Math.PI);
            this.ctx.fill();

        } else {            
            this.ctx.strokeStyle = '#4a200d';
            this.ctx.fillStyle = 'black';
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.arc(bullet.pos.x, bullet.pos.y, logicConfig.sizes.bullets * 2.2, 0, 2 * Math.PI);
            this.ctx.fill();
        }
    }

    displayItem(item) {
        this.ctx.save();
        const img = new Image();
        // this.ctx.beginPath();
        // this.ctx.lineWidth = "6";
        // this.ctx.strokeStyle = "red";
        // this.ctx.rect(item.pos.x - 2.5, item.pos.y - 2.5, 5, 5)
        // this.ctx.stroke();
        // this.ctx.restore();
        // console.log(item.type);
        // console.log(item.type);
        switch (item.type) {
            case 'medPack':
                img.src = medPack;
                this.ctx.drawImage(img, item.pos.x, item.pos.y, 25, 25);
                break;
            case 'ammo':
                img.src = ammo;
                this.ctx.drawImage(img, 150, 25, 50, 20, item.pos.x, item.pos.y, 50, 20);
                break;
            case 'gun':
                img.src = gunSprites;
                this.ctx.drawImage(img, item.pos.x, item.pos.y, 90, 30);
                break;
        }
        this.ctx.restore();
    }
    
    displayPlayer (player) {
        this.ctx.save();
        const img = new Image();
        switch (player.weapon) {
            case 'pistol':
                img.src = playerHandgun;
                this.drawPlayerImage(img, player.pos.x, player.pos.y, 30, 32, 1.2, player.angle);
                break;
            case 'shotgun':
                img.src = playerShotgun;
                this.drawPlayerImage(img, player.pos.x, player.pos.y, 38, 28, 1.2, player.angle);
                break;
            case 'rifle':
                img.src = playerRifle;
                this.drawPlayerImage(img, player.pos.x, player.pos.y, 17, 17, 1.2, player.angle);
                break;      
            default:
                img.src = playerHandgun;
                break;
        }
        this.ctx.restore();

    }

    // https://stackoverflow.com/questions/17411991/html5-canvas-rotate-image
    drawPlayerImage(image, x, y, cx, cy, scale, rotation){
        this.ctx.setTransform(scale, 0, 0, scale, x, y); // sets scale and origin
        this.ctx.rotate(rotation);
        this.ctx.drawImage(image, -cx, -cy);
    }

    drawEnemyImage(image, sx, sy, sWidth, sHeight, x, y, cx, cy, scale, rotation, dWidth, dHeight){
        this.ctx.setTransform(scale, 0, 0, scale, x, y); // sets scale and origin
        this.ctx.rotate(rotation);
        this.ctx.drawImage(image, sx, sy, sWidth, sHeight, -cx, -cy, dWidth, dHeight);
    } 
    
    displayEnemy(enemy) {
        this.ctx.save();

        const img = new Image();
        img.src = zombieSprite;

        let x;
        let y;
        switch (enemy.pic) {
            case 0:
                x = 35;
                y = 20;
                break;
            case 1:
                x = 115;
                y = 20;
                break;
            case 2:
                x = 190;
                y = 20;
                break;
            case 3:
                x = 42;
                y = 95;
                break;
            case 4:
                x = 112;
                y = 95;
                break;
            case 5:
                x = 185;
                y = 95;
                break;
            default:
                x = 200;
                y = 50;
                break;
        }

        if (enemy.status === 'dying') {
            x = 165;
            y = 199;
        }
        this.drawEnemyImage(img, x, y, 65, 70, enemy.pos.x, enemy.pos.y, 27, 40, 0.6, enemy.angle + Math.PI/2, 65, 70);
        this.ctx.restore();

        // this.ctx.save();
        // this.ctx.translate(enemy.pos.x, enemy.pos.y);
        // this.ctx.strokeStyle = '#215910';
        // this.ctx.lineWidth = 2;
        // this.ctx.beginPath();
        // this.ctx.arc(0, 0, logicConfig.sizes.zombie, 0, 2 * Math.PI);
        // this.ctx.stroke();
        // this.ctx.restore();
    }
}

export default Display;