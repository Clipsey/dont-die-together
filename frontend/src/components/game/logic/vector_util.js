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