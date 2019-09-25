import gameConfig from './config';
import { willCollideWithEnemy } from './model_helper';

const sampleState = {
    players: {
        1: {
            pos: {
                x: 100,
                y: 100
            },
            health: 100
        },
        2: {
            pos: {
                x: 200,
                y: 100
            },
            health: 50
        }
    },
    enemies: {
        1: {
            type: 'zombie',
            pos: {
                x: 150,
                y: 300
            },
            health: 100
        },
        2: {
            type: 'zombie',
            pos: {
                x: 20,
                y: 30
            },
            health: 100
        },
        3: {
            type: 'zombie',
            pos: {
                x: 50,
                y: 80
            },
            health: 100
        },
        4: {
            type: 'zombie',
            pos: {
                x: 10,
                y: 130
            },
            health: 100
        },
        5: {
            type: 'zombie',
            pos: {
                x: 60,
                y: 10
            },
            health: 100
        }
    }
};

export default class GameModel {
    constructor(initialState = sampleState) {
        this.gameState = initialState;
        this.speeds = gameConfig.speeds;
        this.sizes = gameConfig.sizes;
    }

    update(inputs, dt) { 
        this.movePlayers(inputs, dt);
        this.moveEnemies(dt);
        return this.gameState;
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
            let unitVector = [
                dirVector[0]/closestDistance, 
                dirVector[1]/closestDistance
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
