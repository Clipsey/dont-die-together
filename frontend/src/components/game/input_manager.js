import React from 'react';

const KEY = {
    UP: 38,
    DOWN: 40,
    LEFT:  37,
    RIGHT: 39,
    SPACE: 32,
    ENTER: 13
};

class InputManager extends React.Component {
    constructor() {
        super();
        this.pressedKeys = { left: 0, right: 0, up: 0, down: 0, space: 0, enter: 0 };
    }

    bindKeys() {
        window.addEventListener('keyup',   this.handleKeys.bind(this, false));
        window.addEventListener('keydown', this.handleKeys.bind(this, true));
    }
      
    unbindKeys() {
        window.removeEventListener('keyup', this.handleKeys);
        window.removeEventListener('keydown', this.handleKeys);
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
            case KEY.SPACE:
                keys.space  = value;
                break;
            case KEY.ENTER:
                keys.enter = value;
                break;
            default:
                break;
        }
        this.pressedKeys = keys;
    }
}

export default InputManager;