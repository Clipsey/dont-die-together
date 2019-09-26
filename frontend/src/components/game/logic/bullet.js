import {
    generateId
} from './model_helper';

import {
    vectorMag,
    findDistance
} from './vector_util';

import {
    playerCanFire
} from './player';

export const fireBullets = (player, playerInputs, gameState, times, speeds) => {
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
        console.log(player.items.guns);
    }
};

export const moveBullet = (bullet, id, dt, gameState, sizes, times, distances, damages, xBound, yBound) => {
    let xDist = bullet.vel.x * dt;
    let yDist = bullet.vel.y * dt;
    bullet.pos.x += xDist;
    bullet.pos.y += yDist;
    if (bullet.pos.x > xBound ||
        bullet.pos.x < 0 ||
        bullet.pos.y > yBound ||
        bullet.pos.y < 0) {
        delete gameState.bullets[id];
    }
    Object.keys(gameState.enemies).forEach((enemyId) => {
        let enemy = gameState.enemies[enemyId];
        let dist = findDistance([enemy.pos.x, enemy.pos.y], [bullet.pos.x, bullet.pos.y]);
        if (dist < sizes[enemy.type] && enemy.status !== 'dying') {
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
                enemy.status = 'dying';
                enemy.timeToDie = times.zombieDie;
            }
            if (bullet.type !== 'rifle') {
                delete gameState.bullets[id];
            }
        }
    });
};