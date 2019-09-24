export default class Player {
    constructor({position, speed}){
        this.position = position;
        this.speed = speed;
    }

    update(keys) {
        if (keys.right) {
            this.position.x += this.speed;
        } else if (keys.left) {
         this.position.x -= this.speed;
        } else if (keys.up) {
            this.position.y -= this.speed;
        } else if (keys.down) {
            this.position.y += this.speed;
        }
    }

    render(state) {
        const context = state.context;
        context.save();
        context.translate(this.position.x, this.position.y);
        context.strokeStyle = '#ffffff';
        context.fillStyle = '#ffffff';
        context.lineWidth = 2;
        context.beginPath();
        context.arc(100, 75, 50, 0, 2 * Math.PI);
        context.stroke();
        context.restore();
    }
}