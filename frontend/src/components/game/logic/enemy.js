import {
    vectorMag
} from './vector_util';
import {
    willCollideWithEnemy
} from './model_helper';

export const moveEnemy = (enemy, gameState, dist, sizes, damages, times) => {
    let enemyPos = enemy.pos;
    let targetPos = null;
    let closestDistance = null;
    let victim = null;
    Object.values(gameState.players).forEach((player) => {
        let playerPos = player.pos;
        let dx = playerPos.x - enemyPos.x;
        let dy = playerPos.y - enemyPos.y;
        let thisDistance = Math.sqrt(dx * dx + dy * dy);
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
        dirVector[0] / vectorMag(dirVector),
        dirVector[1] / vectorMag(dirVector)
    ];
    let moveVector = [
        unitVector[0] * dist,
        unitVector[1] * dist
    ];
    let enemySize = sizes[enemy.type];
    if (closestDistance > enemySize + sizes.player) {
        if (!willCollideWithEnemy(enemy, moveVector, gameState, sizes)) {
            enemy.pos.x = enemy.pos.x + moveVector[0];
            enemy.pos.y = enemy.pos.y + moveVector[1];
        }
    }
    else {
        if (enemy.timeToAttack === 0) {
            victim.health -= damages[enemy.type];
            enemy.timeToAttack = times.zombieReload;
        }
    }
};