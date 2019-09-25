export const vectorMag = (vector) => {
    let x = vector[0];
    let y = vector[1];
    return Math.sqrt(x*x + y*y);
}