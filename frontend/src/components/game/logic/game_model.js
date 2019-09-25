import gameConfig from './config';
import { sampleState } from './config';
import { willCollideWithEnemy } from './model_helper';
import { vectorMag } from './vector_util';

export default class GameModel {
    constructor(initialState = sampleState) {
        this.gameState = initialState;
        this.speeds = gameConfig.speeds;
        this.sizes = gameConfig.sizes;
    }

    update(inputs, dt) { 
        this.movePlayers(inputs, dt);
        this.moveEnemies(dt);
        this.fireBullets(inputs, dt);
        return this.gameState;
    }

    fireBullets(inputs, dt) {
        Object.keys(this.gameState.players).forEach((playerId) => {
            //let player = 
            let playerInputs = inputs[parseInt(playerId)];
            if (this.playerCanFire(player) && playerInputs.fire) {
                let fireVector = [playerInputs.pointX, playerInputs.pointY];
                let unitVector = [
                    fireVector[0]/vectorMag(fireVector),
                    fireVector[1]/vectorMag(fireVector)
                ]
                let newBullet = {
                    type: 'pistol',
                    // pos: {
                    //     x: 
                    // }
                }
            } 
        });
    }

    playerCanFire(player) {
        return true;
    }

    moveEnemies(dt) {
        Object.values(this.gameState.enemies).forEach( (enemy) => {
            let enemyPos = enemy.pos;
            let targetPos = null;
            let closestDistance = null;
            Object.values(this.gameState.players).forEach( (player) => {
                let playerPos = player.pos;
                let dx = playerPos.x - enemyPos.x;
                let dy = playerPos.y - enemyPos.y;
                let thisDistance = Math.sqrt(dx*dx + dy*dy);
                if (closestDistance === null || thisDistance < closestDistance) {
                    closestDistance = thisDistance;
                    targetPos = playerPos;
                }
            });
            let dirVector = [targetPos.x - enemyPos.x, targetPos.y - enemyPos.y];
            if (Math.random() < 0.2) {
                dirVector = [Math.random() - 0.5, Math.random() - 0.5];
                enemy.randomDir = dirVector;
            }
            let unitVector = [
                dirVector[0]/vectorMag(dirVector), 
                dirVector[1]/vectorMag(dirVector)
            ];
            let dist = dt * this.speeds[enemy.type];
            let moveVector = [
                unitVector[0]*dist,
                unitVector[1]*dist
            ];
            let enemySize = this.sizes[enemy.type];
            if (closestDistance > enemySize + this.sizes.player && 
                !willCollideWithEnemy(enemy, moveVector, this.gameState, this.sizes)){
                enemy.pos.x = enemy.pos.x + moveVector[0];
                enemy.pos.y = enemy.pos.y + moveVector[1];
            }
        });
    }

    movePlayers(inputs, dt) {
        let dist = dt*this.speeds.player;
        // Object.keys(this.gameState.players).forEach( (player) => {
        //     let keyVector = [0, 0];
        //     let playerInputs = inputs[parseInt(player)];
        //     if (playerInputs.up) {
        //         keyVector[1] -= 1;
        //     }
        //     if (playerInputs.down) {
        //         keyVector[1] += 1;
        //     }
        //     if (playerInputs.right) {
        //         keyVector[0] += 1;
        //     }
        //     if (playerInputs.left) {
        //         keyVector[0] -= 1;
        //     }
        //     let dx = keyVector[0];
        //     let dy = keyVector[1];
        //     let mag = Math.sqrt(dx*dx + dy*dy);
        //     let unitVector = [
        //         keyVector[0]/mag,
        //         keyVector[1]/mag
        //     ];
        //     let moveVector = [unitVector[0]*dist, unitVector[1]*dist];
        //     this.gameState.players[parseInt(player)].pos.x += moveVector[0];
        //     this.gameState.players[parseInt(player)].pos.y += moveVector[1];
        // });

        Object.keys(this.gameState.players).forEach((player) => {
            let moveVector = [0, 0];
            let playerInputs = inputs[parseInt(player)];
            if (playerInputs.up) {
                this.gameState.players[parseInt(player)].pos.y -= dist;
            }
            if (playerInputs.down) {
                this.gameState.players[parseInt(player)].pos.y += dist;
            }
            if (playerInputs.right) {
                this.gameState.players[parseInt(player)].pos.x += dist;
            }
            if (playerInputs.left) {
                this.gameState.players[parseInt(player)].pos.x -= dist;
            }
        });
    }
}
