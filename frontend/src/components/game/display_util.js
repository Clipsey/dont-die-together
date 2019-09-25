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
    ctx.strokeStyle = '#4a200d';
    ctx.fillStyle = '#4a200d';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, gameConfig.sizes.bullets, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.restore();
};

export const displayPlayer = (player, ctx) => {
    ctx.save();

    ctx.fillFont = 'bold 10px serif';
    ctx.strokeText(`Health: ${player.health}`, player.pos.x - 10, player.pos.y-15);

    ctx.strokeStyle = '#234c70';
    ctx.fillStyle = '#234c70';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(player.pos.x, player.pos.y, gameConfig.sizes.player, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
};

export const displayEnemy = (enemy, ctx) => {
    ctx.save();

    ctx.fillFont = 'bold 10px serif';
    ctx.strokeText(`Health: ${enemy.health}`, enemy.pos.x - 10, enemy.pos.y-15);

    ctx.translate(enemy.pos.x, enemy.pos.y);
    ctx.strokeStyle = '#215910';
    ctx.fillStyle = '#215910';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, gameConfig.sizes.zombie, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
};

export const displayFPS = (dt, ctx) => {
    let fps = (1/dt).toFixed(1);   
    ctx.fillFont = 'bold 10px serif';
    ctx.strokeText(`FPS: ${fps}`, 20, 20);
}