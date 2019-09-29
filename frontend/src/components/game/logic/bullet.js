import {
    generateId,
    willCollideWithObstacle
} from './model_helper';

import {
    vectorMag,
    findDistance
} from './vector_util';

import {
    playerCanFire
} from './player';

export const fireBullets = (player, playerId, playerInputs, gameState, times, speeds) => {
    if (playerCanFire(player) && playerInputs.fire) {
        player.timeToFire = times.reload[player.weapon];
        let fireVector = [playerInputs.pointX, playerInputs.pointY];
        let unitVector = [
            fireVector[0] / vectorMag(fireVector),
            fireVector[1] / vectorMag(fireVector)
        ]
        let speed = speeds.bullet;
        if (player.weapon === 'shotgun') {
            for (let i = 0; i < 8; i++){
                let newFireVector = [
                    unitVector[0] + (Math.random()/5 - 0.1),
                    unitVector[1] + (Math.random()/5 - 0.1)
                ];
                let newUnitVector = [
                    newFireVector[0] / vectorMag(newFireVector),
                    newFireVector[1] / vectorMag(newFireVector)
                ];
                let newBullet = {
                    playerId: playerId,
                    type: player.weapon,
                    pos: {},
                    vel: {}
                };
                newBullet.pos.x = player.pos.x;
                newBullet.pos.y = player.pos.y;
                let newSpeed = speed*(1 + (Math.random()/5 - 0.1));
                newBullet.vel.x = newUnitVector[0] * newSpeed;
                newBullet.vel.y = newUnitVector[1] * newSpeed;
                gameState.bullets[generateId()] = newBullet;
            }

        }
        else {
            let newBullet = {
                playerId: playerId,
                type: player.weapon,
                pos: {},
                vel: {}
            };
            newBullet.pos.x = player.pos.x;
            newBullet.pos.y = player.pos.y;
            newBullet.vel.x = unitVector[0] * speed;
            newBullet.vel.y = unitVector[1] * speed;
            gameState.bullets[generateId()] = newBullet;
        }
        player.ammo -= 1;
        player.items.gunAmmo[player.weapon] -= 1;
    }
};

export const moveBullet = (bullet, id, dt, gameState, sizes, times, distances, damages, xBound, yBound) => {
    let oldPos = {x: bullet.pos.x, y: bullet.pos.y};
    let xDist = bullet.vel.x * dt;
    let yDist = bullet.vel.y * dt;
    let moveVector = [xDist, yDist];
    let stoppedByObstacle = willCollideWithObstacle(bullet, moveVector, gameState, 0);
    if (!stoppedByObstacle) {
        bullet.pos.x += xDist;
        bullet.pos.y += yDist;
        let slope = (bullet.pos.y - oldPos.y) / (bullet.pos.x - oldPos.x);
        let yInt = oldPos.y - (slope * oldPos.x);
        let perpSlope = (-1)*(1/slope);
    
        let bA = bullet.pos.y - (perpSlope * bullet.pos.x);
        let bB = oldPos.y - (perpSlope * oldPos.x);

        Object.keys(gameState.enemies).forEach((enemyId) => {
            let enemy = gameState.enemies[enemyId];
            
            let bTwo = enemy.pos.y - (perpSlope * enemy.pos.x);
            let interX = (bTwo - yInt) / (slope - perpSlope);
            let interY = (slope * interX) + yInt;
            let maxDist = findDistance([interX, interY], [enemy.pos.x, enemy.pos.y]);

            let enemyBetween = ((bTwo > bB && bTwo < bA) || (bTwo < bB && bTwo > bA));

            if (enemy.status !== 'dying' && 
                maxDist < sizes[enemy.type] && 
                enemyBetween) {
                enemy.health -= damages[bullet.type];
                let staggerDir = [bullet.vel.x, bullet.vel.y];
                let unitVector = [
                    staggerDir[0] / vectorMag(staggerDir),
                    staggerDir[1] / vectorMag(staggerDir)
                ];
                let staggerVector = [
                    unitVector[0] * distances.stagger,
                    unitVector[1] * distances.stagger
                ];
                enemy.pos.x += staggerVector[0];
                enemy.pos.y += staggerVector[1];
                if (enemy.health <= 0) {
                    if (!gameState.players[bullet.playerId].killCount){
                        gameState.players[bullet.playerId].killCount = 0;
                    }
                    gameState.players[bullet.playerId].killCount += 1;
                    enemy.status = 'dying';
                    enemy.timeToDie = times.zombieDie;
                }
                if (bullet.type !== 'rifle') {
                    delete gameState.bullets[id];
                }
            }
        });
    }
    if (bullet.pos.x > xBound ||
        bullet.pos.x < 0 ||
        bullet.pos.y > yBound ||
        bullet.pos.y < 0 ||
        stoppedByObstacle) {
        delete gameState.bullets[id];
    }
};