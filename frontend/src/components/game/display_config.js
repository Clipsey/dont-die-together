export const initialState = {
    players: {
        1: {
            pos: {
                x: 100,
                y: 100
            },
            health: 100,
            timeToFire: 0,   //time until able to fire
            weapon: 'pistol',
            ammo: 10
        },
        2: {
            pos: {
                x: 200,
                y: 100
            },
            health: 50,
            timeToFire: 0,
            weapon: 'pistol',
            ammo: 10
        }
    },
    enemies: {
        1: {
            type: 'zombie',
            pos: {
                x: 150,
                y: 300
            },
            health: 100,
            timeToAttack: 0
        },
        2: {
            type: 'zombie',
            pos: {
                x: 20,
                y: 30
            },
            health: 100,
            timeToAttack: 0
        }
    },
    bullets: {

    },
    items: {

    }
};

export const canvasStyle = {
    display: 'block',
    backgroundColor: '#A9A9A9',
    marginLeft: 'auto',
    marginRight: 'auto'
};

export const screenWidth = 800;
export const screenHeight = 600;