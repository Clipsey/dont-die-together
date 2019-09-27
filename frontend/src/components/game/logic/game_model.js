import gameConfig from './config';
import { sampleState } from './config';
import { willCollideWithEnemy } from './model_helper';
import { vectorMag, findDistance } from './vector_util';

export default class GameModel {
    constructor(initialState = sampleState) {
        this.gameState = initialState;
        this.speeds = gameConfig.speeds;
        this.sizes = gameConfig.sizes;
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
            health: 'AMMO',
            pos: {},
            amount: 10
        }
        newItem.pos.x = x;
        newItem.pos.y = y;
        this.gameState.items[Math.random()] = newItem; 
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
        this.gameState.enemies[Math.random()] = newZombie;
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
            let xDist = bullet.vel.x*dt;
            let yDist = bullet.vel.y*dt;
            bullet.pos.x += xDist;
            bullet.pos.y += yDist;
            Object.keys(this.gameState.enemies).forEach( (enemyId) => {
                let enemy = this.gameState.enemies[enemyId];
                let dist = findDistance([enemy.pos.x, enemy.pos.y], [bullet.pos.x, bullet.pos.y]);
                if (dist < gameConfig.sizes[enemy.type] && enemy.status !== 'dying'){
                    enemy.health -= gameConfig.damages[bullet.type];
                    let staggerDir = [bullet.vel.x, bullet.vel.y];
                    let unitVector = [
                        staggerDir[0]/vectorMag(staggerDir),
                        staggerDir[1]/vectorMag(staggerDir)
                    ];
                    let staggerVector = [
                        unitVector[0]*gameConfig.distances.stagger,
                        unitVector[1]*gameConfig.distances.stagger
                    ];
                    enemy.pos.x += staggerVector[0];
                    enemy.pos.y += staggerVector[1];
                    if (enemy.health < 0){
                        enemy.status = 'dying';
                        enemy.timeToDie = gameConfig.times.zombieDie;
                    }
                    if (bullet.type !== 'rifle'){
                        delete this.gameState.bullets[bulletId];
                    }
                }
            });
        });
        Object.keys(this.gameState.bullets).forEach( (bulletId) => {
            let bullet = this.gameState.bullets[bulletId];
            if (bullet.pos.x > gameConfig.gameBounds.x ||
                bullet.pos.x < 0 ||
                bullet.pos.y > gameConfig.gameBounds.y ||
                bullet.pos.y < 0) {
                delete this.gameState.bullets[bulletId];
            }
        });
    }

    fireBullets(inputs) {
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
        });
    }

    playerCanFire(player) {
        return (player.timeToFire === 0 && player.ammo > 0);
    }

    moveEnemies(dt) {
        Object.values(this.gameState.enemies).forEach( (enemy) => {
            if (enemy.status !== 'dying'){
                let enemyPos = enemy.pos;
                let targetPos = null;
                let closestDistance = null;
                let victim = null;
                Object.values(this.gameState.players).forEach( (player) => {
                    let playerPos = player.pos;
                    let dx = playerPos.x - enemyPos.x;
                    let dy = playerPos.y - enemyPos.y;
                    let thisDistance = Math.sqrt(dx*dx + dy*dy);
                    if (closestDistance === null || thisDistance < closestDistance) {
                        victim = player;
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
                if (closestDistance > enemySize + this.sizes.player) { 
                    if (!willCollideWithEnemy(enemy, moveVector, this.gameState, this.sizes)){
                        enemy.pos.x = enemy.pos.x + moveVector[0];
                        enemy.pos.y = enemy.pos.y + moveVector[1];
                    }
                }
                else {
                    if (enemy.timeToAttack === 0){
                        victim.health -= gameConfig.damages[enemy.type];
                        enemy.timeToAttack = gameConfig.times.zombieReload;
                    }
                }
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
        });
    }
}
