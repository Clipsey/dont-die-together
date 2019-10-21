import {
    vectorMag,
    calcRotation
} from './vector_util';
import {
    willCollideWithEnemy,
    willCollideWithObstacle,
    generateId
} from './model_helper';
import gameConfig from './config';
import {
    playSound,
    playHeartBeat
} from './sounds/soundsUtil';

export const moveEnemy = (enemy, gameState, dist, sizes, damages, times) => {
    let enemyPos = enemy.pos;
    let targetPos = null;
    let closestDistance = null;
    let victim = null;

    Object.values(gameState.players).forEach((player) => {
        if (player.status !== 'dead'){
            let playerPos = player.pos;
            let dx = playerPos.x - enemyPos.x;
            let dy = playerPos.y - enemyPos.y;
            let thisDistance = Math.sqrt(dx * dx + dy * dy);
            if (closestDistance === null || thisDistance < closestDistance) {
                victim = player;
                closestDistance = thisDistance;
                targetPos = playerPos;
            }
        }
    });
    if (targetPos === null) {
        targetPos = {x: gameConfig.gameBounds.x / 2, y: gameConfig.gameBounds.y / 2};
        let dx = targetPos.x - enemyPos.x;
        let dy = targetPos.y - enemyPos.y;
        closestDistance = Math.sqrt((dx * dx) + (dy + dy));
    }
    let dirVector = [targetPos.x - enemyPos.x, targetPos.y - enemyPos.y];
    if (enemy.timeSwitchDir === 0){
        if (Math.random() < 0.2){
            enemy.aimless = true;
            dirVector = [Math.random() - 0.5, Math.random() - 0.5];
            enemy.randomDir = dirVector;
        }
        else {
            enemy.aimless = false;
        }
        enemy.timeSwitchDir = times.zombieSwitchDir;
    }


  
    if (enemy.aimless) {
        dirVector = enemy.randomDir;
    }
    let unitVector = [
        dirVector[0] / vectorMag(dirVector),
        dirVector[1] / vectorMag(dirVector)
    ];
    let moveVector = [
        unitVector[0] * dist,
        unitVector[1] * dist
    ];
    let enemySize = sizes[enemy.type];
    
    
    if (closestDistance > enemySize + sizes.player) {
        if (!willCollideWithEnemy(enemy, moveVector, gameState, sizes) &&
            !willCollideWithObstacle(enemy, moveVector, gameState, sizes.zombie)) {
            enemy.pos.x = enemy.pos.x + moveVector[0];
            enemy.pos.y = enemy.pos.y + moveVector[1];
        }
    }
    else {
        if (enemy.timeToAttack === 0 && victim && victim.status !== 'dead') {
            victim.health -= damages[enemy.type];
            enemy.timeToAttack = times.zombieReload;
            if (Math.random() < 0.5){
                playSound('fleshEating');
            }
            else {
                playSound('fleshEating2');
            }
            if (victim.health < 50) {
                playHeartBeat(2 * ((100 - victim.health) / 100));
            }
            else {
                if (Math.random() < 0.05){
                    playSound('creepyScream');
                }
            }
            if (victim.health < 0) {
                victim.timeToSpawn = gameConfig.times.playerSpawn;
                victim.killCount = 0;
                victim.status = 'dead';
                playSound('playerDeath');
                playHeartBeat(-1);
            }
        }
    }

    if (!enemy.angle){
        enemy.angle = 0;
    }
    enemy.angle = calcRotation([moveVector[0], moveVector[1]]);
    
};

export const generateZombie = (gameState) => {
    let x = Math.random() * gameConfig.gameBounds.x;
    let y = Math.random() * gameConfig.gameBounds.y;

    if (Math.random() < 0.5) {
        x = (Math.random() < 0.5 ? 0 : gameConfig.gameBounds.x);
    }
    else {
        y = (Math.random() < 0.5 ? 0 : gameConfig.gameBounds.y);
    }
    let newZombie = {
        type: 'zombie',
        pic: 0,
        pos: {},
        randomDir: {},
        health: 100,
        timeToAttack: 0,
        timeSwitchDir: 0,
        timeToAnimate: 0,
        aimless: false
    }
    newZombie.pos.x = x;
    newZombie.pos.y = y;

    let moveVector = [0, 0];
    if (!willCollideWithEnemy(newZombie, moveVector, gameState, gameConfig.sizes) &&
        !willCollideWithObstacle(newZombie, moveVector, gameState, gameConfig.sizes.zombie)) {
        gameState.enemies[generateId()] = newZombie;
    }
}

export const animateEnemy = (enemy) => {
    enemy.pic += 1;
    enemy.pic = enemy.pic % gameConfig.numbers.zombieAnimatePics;
}