import React from 'react';

const KEY = {
    UP: 87,
    DOWN: 83,
    LEFT:  65,
    RIGHT: 68,
    FIRE: 32,
    ENTER: 13,
    CYCLEGUN: 81
};

class InputManager extends React.Component {
    constructor() {
        super();
        this.pressedKeys = { left: false, right: false, up: false, down: false, fire: false, enter: false, cycleGun: false };
        this.mousePos = {
            x: -1,
            y: -1
        };
    }

    bindKeys() {
        let canvas = document.getElementById('canvas');
        window.addEventListener('keyup',   this.handleKeys.bind(this, false));
        window.addEventListener('keydown', this.handleKeys.bind(this, true));
        window.addEventListener('mousemove', e => {
            this.mousePos = this.getMousePos(canvas, e)
        })
        window.addEventListener('mousedown', e => this.pressedKeys.fire = true);
        window.addEventListener('mouseup', e => this.pressedKeys.fire = false);
    }
      
    unbindKeys() {
        window.removeEventListener('keyup', this.handleKeys);
        window.removeEventListener('keydown', this.handleKeys);
    }

    getMousePos(canvas, e) {
        let rect = canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }
      
    handleKeys(value, e){
        let keys = this.pressedKeys;
        switch (e.keyCode) {
            case KEY.UP:
                keys.up = value;
                break;
            case KEY.DOWN:
                keys.down = value;
                break;
            case KEY.LEFT:
                keys.left  = value;
                break;
            case KEY.RIGHT:
                keys.right  = value;
                break;
            case KEY.FIRE:
                keys.fire  = value;
                break;
            case KEY.ENTER:
                keys.enter = value;
                break;
            case KEY.CYCLEGUN:
                keys.cycleGun = value;
                break;
            default:
                break;
        }
        this.pressedKeys = keys;
    }
}

export default InputManager;