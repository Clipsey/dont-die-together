import * as DisplayConfig from './display_config';
import gameConfig from './logic/config';

export const clearScreen = ctx => {
    ctx.save();
    ctx.fillStyle = DisplayConfig.canvasStyle.backgroundColor;
    ctx.fillRect(0, 0, DisplayConfig.screenWidth, DisplayConfig.screenHeight);
};

export const displayBullet = (bullet, ctx) => {
    ctx.save();
    ctx.translate(bullet.pos.x, bullet.pos.y);
    ctx.strokeStyle = '#ccccfc';
    ctx.fillStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, gameConfig.sizes.bullets, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.restore();
};

export const displayPlayer = (player, ctx) => {
    ctx.save();
    ctx.strokeStyle = '#ffffff';
    ctx.fillStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(player.pos.x, player.pos.y, gameConfig.sizes.player, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.restore();
};

export const displayEnemy = (enemy, ctx) => {
    ctx.save();
    ctx.translate(enemy.pos.x, enemy.pos.y);
    ctx.strokeStyle = '#ccccfc';
    ctx.fillStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, gameConfig.sizes.zombie, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.restore();
};

export const displayFPS = (dt, ctx) => {
    let fps = (1/dt).toFixed(1);   
    ctx.fillFont = 'bold 10px serif';
    ctx.strokeText(`FPS: ${fps}`, 20, 20);
}