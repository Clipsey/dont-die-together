import gameConfig from './config';
import {
    willCollideWithEnemy
} from './model_helper';
import {
    findDistance,
    vectorMag
} from './vector_util';

export const movePlayer = (player, playerInputs, gameState, sizes, dt, dist) => {
    //// BEGIN ACC
    let inputVector = [0, 0];
    if (playerInputs.up) {
        inputVector[1] -= 1;
    }
    if (playerInputs.down) {
        inputVector[1] += 1;
    }
    if (playerInputs.right) {
        inputVector[0] += 1;
    }
    if (playerInputs.left) {
        inputVector[0] -= 1;
    }
    if (inputVector[0] !== 0 || inputVector[1] !== 0) {
        let unitDir = [
            inputVector[0] / vectorMag(inputVector),
            inputVector[1] / vectorMag(inputVector)
        ];
        let accVector = [
            unitDir[0] * gameConfig.acceleration.player,
            unitDir[1] * gameConfig.acceleration.player
        ];
        let accAmt = [
            accVector[0] * dt,
            accVector[1] * dt
        ];
        player.velocity.x += accAmt[0];
        player.velocity.y += accAmt[1];
        let playerSpeed = vectorMag([player.velocity.x, player.velocity.y]);
        if (playerSpeed > gameConfig.speeds.player){
            player.velocity.x *= gameConfig.speeds.player / playerSpeed;
            player.velocity.y *= gameConfig.speeds.player / playerSpeed;
        }
        let moveVector = [player.velocity.x * dt, player.velocity.y * dt];
        
        if (!willCollideWithEnemy(player, moveVector, gameState, sizes)) {
            player.pos.x += moveVector[0];
            player.pos.y += moveVector[1];
        }
    }
    else {
        player.velocity.x = 0;
        player.velocity.y = 0;
    }

    //// END ACC

    // let moveVector = [0, 0];     ///BEGIN NORMAL
    // if (playerInputs.up) {
    //     moveVector[1] -= dist;
    // }
    // if (playerInputs.down) {
    //     moveVector[1] += dist;
    // }sddw
    // if (playerInputs.right) {
    //     moveVector[0] += dist;
    // }
    // if (playerInputs.left) {
    //     moveVector[0] -= dist;
    // }                            ///END NORMAL

    
};

export const switchGuns = (player, playerInputs, times) => {
    if (playerInputs.cycleGun) {
        if (player.timeToSwitch === 0) {
            let availableGuns = Object.keys(player.items.guns).filter( (key) => {
                return player.items.guns[key];
            });
            let newGunIdx = (availableGuns.indexOf(player.weapon) + 1) % availableGuns.length;
            player.weapon = availableGuns[newGunIdx];
            player.ammo = player.items.gunAmmo[player.weapon];
            player.timeToSwitch = times.switchGuns;
        }
        console.log('switched to ' + player.weapon);
    }
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

