import gameConfig from './config';
import {
    generateId
} from './model_helper';

export const generateItem = (gameState) => {
    let x = Math.random() * gameConfig.gameBounds.x;
    let y = Math.random() * gameConfig.gameBounds.y;
    let itemType = ['gun', 'medPack', 'ammo'][Math.floor(Math.random() * 3)];
    const newItem = {};
    switch (itemType) {
        case 'ammo':
            newItem.type = 'ammo';
            newItem.gun = [
                'pistol',
                'pistol',
                'pistol',
                'rifle',
                'shotgun'
            ][Math.floor(Math.random() * 5)];
            newItem.pos = {};
            newItem.amount = 5;
            break;
        case 'gun':
            newItem.type = 'gun';
            newItem.gun = [
                'rifle',
                'shotgun'
            ][Math.floor(Math.random() * 2)];
            newItem.pos = {};
            break;
        case 'medPack':
            newItem.type = 'medPack';
            newItem.amount = 50;
            newItem.pos = {};
            break;
        default:
            break;
    }
    newItem.pos.x = x;
    newItem.pos.y = y;
    gameState.items[generateId()] = newItem;
}