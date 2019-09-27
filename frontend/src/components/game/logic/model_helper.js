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
            if (distance < personSize + sizes.zombie) {
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
    let answer = true;
    Object.values(gameState.obstacles).forEach( (obstacle) => {
        if (newPos.y < (obstacle.topLeft.y - size)){
            answer = false; //above
        }
        else if (newPos.y > (obstacle.bottomRight.y + size)){
            answer = false; //below
        }
        else if (newPos.x < (obstacle.topLeft.x - size)){
            answer = false; //left
        }
        else if (newPos.x > (obstacle.bottomRight.x + size)){
            answer = false; //right
        }
    });
    return answer;
}

export const generateId = () => {
    return Math.random();
}