import gameConfig from './config';
import {
    generateId
} from './model_helper';

export const generateItem = (gameState) => {
    let x = Math.random() * gameConfig.gameBounds.x;
    let y = Math.random() * gameConfig.gameBounds.y;
    let itemType = ['ammo', 'gun', 'medPack'][Math.floor(Math.random() * 3)];
    let newItem = {};
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
        case 'gun':
            newItem.type = 'gun';
            newItem.gun = [
                'rifle',
                'shotgun'
            ][Math.floor(Math.random() * 5)];
            newItem.pos = {};
        case 'medPack':
            newItem.type = 'medPack';
            newItem.amount = 50;
            newItem.pos = {};
    }
    newItem.pos.x = x;
    newItem.pos.y = y;
    gameState.items[generateId()] = newItem;
}