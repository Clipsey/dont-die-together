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
    pickUpItems
} from './player';
import {
    fireBullets,
    moveBullet
} from './bullet';
import { 
    vectorMag, 
    findDistance 
} from './vector_util';

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
    }

    update(inputs, dt) { 
        this.updateTimes(dt);
        this.movePlayers(inputs, dt);
        this.moveEnemies(dt);
        this.moveBullets(dt);
        this.fireBullets(inputs);
        return this.gameState;
    }

    generateItem(dt) {
        let x = Math.random()*gameConfig.gameBounds.x;
        let y = Math.random()*gameConfig.gameBounds.y;
        let newItem = {
            type: 'ammo',
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

    fireBullets(inputs) {
        Object.keys(this.gameState.players).forEach((playerId) => {
            let player = this.gameState.players[parseInt(playerId)];
            let playerInputs = inputs[parseInt(playerId)];
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
            let playerInputs = inputs[parseInt(playerId)];
            movePlayer(player, playerInputs, this.gameState, this.sizes, dist);
            pickUpItems(player, this.gameState, this.sizes);
        });
    }
}
