import {
    findDistance
} from './vector_util';

export const willCollideWithEnemy = (person, moveVector, gameState, sizes) => {
    let newPos = {
        x: person.pos.x + moveVector[0],
        y: person.pos.y + moveVector[1]
    }

    let personSize = 0;
    if (person.type === 'zombie') {
        personSize = sizes.zombie;
    }
    else {
        personSize = sizes.player;
    }
    
    let answer = false;
    Object.values(gameState.enemies).forEach( (enemy) => {
        if (person.pos.x !== enemy.pos.x || person.pos.y !== enemy.pos.y) {
            let dx = enemy.pos.x - newPos.x;
            let dy = enemy.pos.y - newPos.y;
            let distance = Math.sqrt(dx*dx + dy*dy);
            if (distance < personSize + sizes.zombie && enemy.status !== 'dying') {
                answer = true;
            }
        }
    });
    return answer;
}

export const willCollideWithObstacle = (entity, moveVector, gameState, size) => {
    let newPos = {
        x: entity.pos.x + moveVector[0],
        y: entity.pos.y + moveVector[1]
    }
    let answer = false;
    Object.values(gameState.obstacles).forEach( (obstacle) => {
        let collideHere = true;
        if (newPos.y < (obstacle.topLeft.y - size)){
            collideHere = false; //above
        }
        else if (newPos.y > (obstacle.bottomRight.y + size)){
            collideHere = false; //below
        }
        else if (newPos.x < (obstacle.topLeft.x - size)){
            collideHere = false; //left
        }
        else if (newPos.x > (obstacle.bottomRight.x + size)){
            collideHere = false; //right
        }
        else if (newPos.y < obstacle.topLeft.y && newPos.x < obstacle.topLeft.x) {
            let obsPos = [obstacle.topLeft.x, obstacle.topLeft.y];
            let entPos = [newPos.x, newPos.y];
            if (size < findDistance(obsPos, entPos)) {
                collideHere = false; //above left
            } 
        }
        else if (newPos.y > obstacle.bottomRight.y && newPos.x < obstacle.topLeft.x) {
            let obsPos = [obstacle.topLeft.x, obstacle.bottomRight.y];
            let entPos = [newPos.x, newPos.y];
            if (size < findDistance(obsPos, entPos)) {
                collideHere = false; //below left
            }  
        }
        else if (newPos.y < obstacle.topLeft.y && newPos.x > obstacle.bottomRight.x) {
            let obsPos = [obstacle.bottomRight.x, obstacle.topLeft.y];
            let entPos = [newPos.x, newPos.y];
            if (size < findDistance(obsPos, entPos)) {
                collideHere = false; //above right
            }  
        }
        else if (newPos.y > obstacle.bottomRight.y && newPos.x > obstacle.bottomRight.x) {
            let obsPos = [obstacle.bottomRight.x, obstacle.bottomRight.y];
            let entPos = [newPos.x, newPos.y];
            if (size < findDistance(obsPos, entPos)) {
                collideHere = false; //below right
            }   
        }
        if (collideHere) {
            answer = true;
        }
    });
    return answer;
}

export const generateId = () => {
    return Math.random();
}