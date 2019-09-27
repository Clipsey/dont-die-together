import gameConfig from './config';
import { sampleState } from './config';

import {
    moveEnemy
} from './enemy';
import { 
    willCollideWithEnemy,
    generateId
} from './model_helper';
import {
    movePlayer,
    pickUpItems,
    switchGuns
} from './player';
import {
    fireBullets,
    moveBullet
} from './bullet';

export default class GameModel {
    constructor(initialState = sampleState) {
        this.gameState = initialState;
        this.maxX = gameConfig.gameBounds.x;
        this.maxY = gameConfig.gameBounds.y;
        this.speeds = gameConfig.speeds;
        this.sizes = gameConfig.sizes;
        this.damages = gameConfig.damages;
        this.distances = gameConfig.distances;
        this.times = gameConfig.times;
        this.generateZombieTime = 0;
        this.generateItemTime = 0;

    //     //EXPERIMENTAL
    //     this.inputs = {
    //         1: {
    //             up: false,
    //             down: false,
    //             left: false,
    //             right: false,
    //             fire: false,
    //             cycleGun: false
    //         }
    //     };
    //     window.setInterval( () => {
    //         this.updateTimes(0.02);
    //         this.movePlayers(this.inputs, 0.02);
    //         this.moveEnemies(0.02);
    //         this.moveBullets(0.02);
    //         this.fireBullets(this.inputs);
    //         this.switchGuns(this.inputs);
    //         return this.gameState;
    //     }, 20);
    }

    // //EXPERIMENTAL
    // update(inputs, dt) {
    //     this.inputs = inputs;
    //     return this.gameState;
    // }

    update(inputs, dt) { 
        this.updateTimes(dt);
        this.movePlayers(inputs, dt);
        this.moveEnemies(dt);
        this.moveBullets(dt);
        this.fireBullets(inputs);
        this.switchGuns(inputs);
        return this.gameState;
    }

    replaceGameState(newState) {
        this.gameState = newState;
    }

    generateItem(dt) {
        let x = Math.random()*gameConfig.gameBounds.x;
        let y = Math.random()*gameConfig.gameBounds.y;
        let newItem = {
            type: 'ammo',
            gun: [
                'pistol', 
                'pistol', 
                'pistol', 
                'rifle', 
                'shotgun'
            ][Math.floor(Math.random()*5)],
            pos: {},
            amount: 10
        }
        newItem.pos.x = x;
        newItem.pos.y = y;
        this.gameState.items[generateId()] = newItem; 
    }

    generateZombie() {
        let x = Math.random()*gameConfig.gameBounds.x;
        let y = Math.random()*gameConfig.gameBounds.y;
        if(Math.random() < 0.5){
            x = (Math.random() < 0.5 ? 0 : gameConfig.gameBounds.x);
        }
        else {
            y = (Math.random() < 0.5 ? 0 : gameConfig.gameBounds.y);
        }
        let newZombie = {
            type: 'zombie',
            pos: {},
            health: 100,
            timeToAttack: 0
        }
        newZombie.pos.x = x;
        newZombie.pos.y = y;
        this.gameState.enemies[generateId()] = newZombie;
    }

    updateTimes(dt) { 
        if (this.generateItemTime === 0) {
            this.generateItem();
            this.generateItemTime = gameConfig.times.itemGenerate;
        }
        else {
            this.generateItemTime -= dt;
            if (this.generateItemTime < 0) {
                this.generateItemTime = 0;
            }
        }
        if (this.generateZombieTime === 0){
            this.generateZombie();
            this.generateZombieTime = gameConfig.times.zombieGenerate;
        }
        else {
            this.generateZombieTime -= dt;
            if (this.generateZombieTime < 0){
                this.generateZombieTime = 0;
            }
        }
        Object.values(this.gameState.players).forEach( (player) => {
            player.timeToFire -= dt;
            if (player.timeToFire < 0){
                player.timeToFire = 0;
            }
            player.timeToSwitch -= dt;
            if (player.timeToSwitch < 0){
                player.timeToSwitch = 0;
            }
        });
        Object.keys(this.gameState.enemies).forEach( (enemyId) => {
            let enemy = this.gameState.enemies[enemyId];
            if (enemy.status === 'dying') {
                enemy.timeToDie -= dt;
                if (enemy.timeToDie < 0) {
                    delete this.gameState.enemies[enemyId];
                }
            }
            if (enemy.timeToAttack > 0){
                enemy.timeToAttack -= dt;
                if (enemy.timeToAttack < 0){
                    enemy.timeToAttack = 0;
                }
            }
        });
    }

    moveBullets(dt) {
        Object.keys(this.gameState.bullets).forEach( (bulletId) => {
            let bullet = this.gameState.bullets[bulletId];
            moveBullet(bullet, bulletId, dt, this.gameState, 
                this.sizes, this.times, this.distances, this.damages, 
                this.maxX, this.maxY);
        });
    }

    switchGuns(inputs) {
        Object.keys(this.gameState.players).forEach((playerId) => {
            let player = this.gameState.players[playerId];
            let playerInputs = inputs[playerId];
            if (this.playerCanFire(player) && playerInputs.fire) {
                player.timeToFire = gameConfig.times.pistolReload;
                let fireVector = [playerInputs.pointX, playerInputs.pointY];
                let unitVector = [
                    fireVector[0]/vectorMag(fireVector),
                    fireVector[1]/vectorMag(fireVector)
                ]
                let speed = this.speeds.bullet;
                let newBullet = {
                    type: 'pistol',
                    pos: {},
                    vel: {}
                };
                newBullet.pos.x = player.pos.x;
                newBullet.pos.y = player.pos.y;
                newBullet.vel.x = unitVector[0]*speed;
                newBullet.vel.y = unitVector[1]*speed;
                this.gameState.bullets[Math.random()] = newBullet; 
                player.ammo -= 1;
                console.log('ammo left: ' + player.ammo);
            } 
            let player = this.gameState.players[playerId];
            let playerInputs = inputs[playerId];
            switchGuns(player, playerInputs, this.times);
        });
    }

    fireBullets(inputs) {
        Object.keys(this.gameState.players).forEach((playerId) => {
            let player = this.gameState.players[playerId];
            let playerInputs = inputs[playerId];
            fireBullets(player, playerInputs, this.gameState, this.times, this.speeds);
        });
    }

    moveEnemies(dt) {
        Object.values(this.gameState.enemies).forEach( (enemy) => {
            if (enemy.status !== 'dying'){
                let dist = dt * this.speeds[enemy.type];
                moveEnemy(enemy, this.gameState, dist, this.sizes, this.damages, this.times);
            }
        });
    }

    movePlayers(inputs, dt) {
        let dist = dt*this.speeds.player;
        Object.keys(this.gameState.players).forEach((playerId) => {
            let player = this.gameState.players[playerId];
            let moveVector = [0, 0];
            let playerInputs = inputs[playerId];
            if (playerInputs.up) {
                player.pos.y -= dist;
            }
            if (playerInputs.down) {
                player.pos.y += dist;
            }
            if (playerInputs.right) {
                player.pos.x += dist;
            }
            if (playerInputs.left) {
                player.pos.x -= dist;
            }
            
            Object.keys(this.gameState.items).forEach( (itemId) => {
                let item = this.gameState.items[itemId];
                if (item.type !== 'ammo'){
                    return;
                }
                let itemPos = [item.pos.x, item.pos.y];
                let playerPos = [player.pos.x, player.pos.y];
                let dist = findDistance(itemPos, playerPos);
                if (dist < 20){
                    player.ammo += item.amount;
                    delete this.gameState.items[itemId];
                }
            });
            let playerInputs = inputs[playerId];
            movePlayer(player, playerInputs, this.gameState, this.sizes, dt, dist);
            pickUpItems(player, this.gameState, this.sizes);
        });
    }
}
