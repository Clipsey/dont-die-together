export const vectorMag = (vector) => {
    let x = vector[0];
    let y = vector[1];
    return Math.sqrt(x*x + y*y);
}

export const findDistance = (pos1, pos2) => {
    let dx = pos1[0] - pos2[0];
    let dy = pos1[1] - pos2[1];
    return Math.sqrt(dx*dx + dy*dy);
}

export const calcRotation = (vector) => {
    let newX = Math.abs(vector[0]);
    let newY = Math.abs(vector[1]);
    let angle = Math.atan(newY/newX);

    if (vector[0] < 0 && vector[1] > 0) angle += 2*(Math.PI / 2 - angle);
    if (vector[0] < 0 && vector[1] < 0) angle += Math.PI;
    if (vector[0] > 0 && vector[1] < 0) angle *= -1;

    return angle;
}