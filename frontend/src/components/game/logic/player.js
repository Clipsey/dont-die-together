export const movePlayer = (player, playerInputs, dist) => {
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
    player.pos.x += moveVector[0];
    player.pos.y += moveVector[1];
}