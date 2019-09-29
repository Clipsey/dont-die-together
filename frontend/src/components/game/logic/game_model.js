import gameConfig from './config';
import { sampleState } from './config';
import { vectorMag, findDistance } from './vector_util';

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
    switchGuns,
    playerCanFire
} from './player';
import {
    fireBullets,
    moveBullet
} from './bullet';

export default class GameModel {
    constructor(initialState = sampleState) {
        this.gameState = initialState;
        this.gameState.obstacles = {};          // DELETE LATER
        // this.gameState.obstacles[1] = {
        //     type: 'rocks',
        //     topLeft: {
        //         x: 200,
        //         y: 200,
        //     },
        //     bottomRight: {
        //         x: 300,
        //         y: 300,
        //     }
        // }
        // this.gameState.obstacles[2] = {
        //     type: 'rocks',
        //     topLeft: {
        //         x: 400,
        //         y: 400,
        //     },
        //     bottomRight: {
        //         x: 500,
        //         y: 500,
        //     }
        // }
        // this.gameState.items = {
        //     1: {
        //         type: 'ammo',
        //         gun: 'shotgun',
        //         pos: {
        //             x: 205,
        //             y: 205
        //         },
        //         amount: 10
        //     },
        //     2: {
        //         type: 'ammo',
        //         gun: 'shotgun',
        //         pos: {
        //             x: 295,
        //             y: 205
        //         },
        //         amount: 10
        //     },
        //     3: {
        //         type: 'ammo',
        //         gun: 'shotgun',
        //         pos: {
        //             x: 295,
        //             y: 295
        //         },
        //         amount: 10
        //     },
        //     4: {
        //         type: 'ammo',
        //         gun: 'shotgun',
        //         pos: {
        //             x: 205,
        //             y: 295
        //         },
        //         amount: 10
        //     },
        //     5: {
        //         type: 'ammo',
        //         gun: 'shotgun',
        //         pos: {
        //             x: 405,
        //             y: 405
        //         },
        //         amount: 10
        //     },
        //     6: {
        //         type: 'ammo',
        //         gun: 'shotgun',
        //         pos: {
        //             x: 495,
        //             y: 405
        //         },
        //         amount: 10
        //     },
        //     7: {
        //         type: 'ammo',
        //         gun: 'shotgun',
        //         pos: {
        //             x: 495,
        //             y: 495
        //         },
        //         amount: 10
        //     },
        //     8: {
        //         type: 'ammo',
        //         gun: 'shotgun',
        //         pos: {
        //             x: 405,
        //             y: 495
        //         },
        //         amount: 10
        //     },
        // }                                       // DELETE LATER
        this.maxX = gameConfig.gameBounds.x;
        this.maxY = gameConfig.gameBounds.y;
        this.speeds = gameConfig.speeds;
        this.sizes = gameConfig.sizes;
        this.damages = gameConfig.damages;
        this.distances = gameConfig.distances;
        this.times = gameConfig.times;
        this.generateZombieTime = 0;
        this.generateItemTime = 0;
    }
    
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
        let itemType = ['ammo', 'gun', 'medPack'][Math.floor(Math.random()*3)];
        let newItem = {};
        switch (itemType) {
            case 'ammo':
                newItem.type = 'ammo';
                newItem.gun = [
                    'pistol',
                    'pistol',
                    'pistol',
                    'rifle',
                    'shotgun'
                ][Math.floor(Math.random() * 5)];
                newItem.pos = {};
                newItem.amount = 5;
            case 'gun':
                newItem.type = 'gun';
                newItem.gun = [
                    'pistol',
                    'pistol',
                    'pistol',
                    'rifle',
                    'shotgun'
                ][Math.floor(Math.random() * 5)];
                newItem.pos = {};
            case 'medPack':
                newItem.type = 'medPack';
                newItem.amount = 50;
                newItem.pos = {};
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
            randomDir: {},
            health: 100,
            timeToAttack: 0,
            timeSwitchDir: 0,
            aimless: false
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
            this.generateZombieTime = 
            (gameConfig.times.zombieGenerate)/(Object.keys(this.gameState.players).length);
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
            if (!player.timeToSwitch || player.timeToSwitch < 0){
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
            if (enemy.timeSwitchDir > 0) {
                enemy.timeSwitchDir -= dt;
                if (enemy.timeSwitchDir < 0) {
                    enemy.timeSwitchDir = 0;
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
            switchGuns(player, playerInputs, this.times);
        });
    }

    fireBullets(inputs) {
        Object.keys(this.gameState.players).forEach((playerId) => {
            let player = this.gameState.players[playerId];
            let playerInputs = inputs[playerId];
            fireBullets(player, playerId, playerInputs, this.gameState, this.times, this.speeds);
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
            let playerInputs = inputs[playerId];
            movePlayer(player, playerInputs, this.gameState, this.sizes, dt, dist);
            pickUpItems(player, this.gameState, this.sizes);
        });
    }
}
