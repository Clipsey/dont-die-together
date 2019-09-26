import {
    willCollideWithEnemy
} from './model_helper';
import {
    findDistance
} from './vector_util';

export const movePlayer = (player, playerInputs, gameState, sizes, dist) => {
    let moveVector = [0, 0];
    if (playerInputs.up) {
        moveVector[1] -= dist;
    }
    if (playerInputs.down) {
        moveVector[1] += dist;
    }
    if (playerInputs.right) {
        moveVector[0] += dist;
    }
    if (playerInputs.left) {
        moveVector[0] -= dist;
    }
    if (!willCollideWithEnemy(player, moveVector, gameState, sizes)){
        player.pos.x += moveVector[0];
        player.pos.y += moveVector[1];
    }
};

export const switchGuns = (player, playerInputs) => {
    
};

export const receiveItem = (player, item) => {
    if (item.type === 'ammo') {
        player.items.gunAmmo[item.gun] += item.amount;
        if (player.weapon === item.gun) {
            player.ammo += item.amount;
        }
    }
    if (item.type === 'gun') {
        player.items.guns[item.gun] = true;
    }
}

export const pickUpItems = (player, gameState, sizes) => {
    Object.keys(gameState.items).forEach( (itemId) => {
        let item = gameState.items[itemId];
        let itemPos = [item.pos.x, item.pos.y];
        let playerPos = [player.pos.x, player.pos.y];
        let dist = findDistance(itemPos, playerPos);
        if (dist < sizes.player + sizes.item) {
            receiveItem(player, item);
            delete gameState.items[itemId];
        }
    });
}

export const playerCanFire = (player) => {
    return (player.timeToFire === 0 && player.ammo > 0);
}

