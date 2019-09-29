import gameConfig from './config';
import { sampleState } from './config';
import { vectorMag, findDistance } from './vector_util';

import {
    moveEnemy,
    generateZombie,
    animateEnemy
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
import {
    generateItem
} from './item';

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

    updateTimes(dt) { 
        if (this.generateItemTime === 0) {
            generateItem(this.gameState);
            this.generateItemTime = gameConfig.times.itemGenerate;
        }
        else {
            this.generateItemTime -= dt;
            if (this.generateItemTime < 0) {
                this.generateItemTime = 0;
            }
        }
        if (this.generateZombieTime === 0){
            generateZombie(this.gameState);
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
            if (enemy.timeToAnimate === 0){
                animateEnemy(enemy);
                enemy.timeToAnimate = gameConfig.times.zombieAnimateTime;
            }
            else {
                enemy.timeToAnimate -= dt;
                if (enemy.timeToAnimate < 0) {
                    enemy.timeToAnimate = 0;
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
