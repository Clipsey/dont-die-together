export const emptyState = {
    players: { },
    enemies: { },
    bullets: { },
    items: { },
    obstacles: {
        1: {
            topLeft: {
                x: 39,
                y: 65,
            },
            bottomRight: {
                x: 50,
                y: 220
            }
        },
        2: {
            topLeft: {
                x: 51,
                y: 65,
            },
            bottomRight: {
                x: 199,
                y: 76
            }
        },
        3: {
            topLeft: {
                x: 51,
                y: 210,
            },
            bottomRight: {
                x: 120,
                y: 220
            }
        },
        4: {
            topLeft: {
                x: 154,
                y: 208,
            },
            bottomRight: {
                x: 190,
                y: 217
            }
        },
        5: {
            topLeft: {
                x: 191,
                y: 77,
            },
            bottomRight: {
                x: 200,
                y: 140
            }
        },
        6: {
            topLeft: {
                x: 190,
                y: 175,
            },
            bottomRight: {
                x: 199,
                y: 217
            }
        },
    }
};

export const newPlayer = {
    pos: {
        x: 600,
        y: 400
    },
    velocity: {
        x: 0,
        y: 0
    },
    health: 100,
    timeToFire: 0,   //time until able to fire
    timeToSwitch: 0,
    weapon: 'pistol',
    items: {
        guns: {
            pistol: true,
            shotgun: true,
            rifle: true
        },
        gunAmmo: {
            pistol: 500000,
            shotgun: 500000,
            rifle: 500000,
        }
    },
    ammo: 100,
    killCount: 0
}

export const canvasStyle = {
    display: 'block',
    backgroundColor: '#A9A9A9',
    marginLeft: 'auto',
    marginRight: 'auto'
};

export const screenWidth = 1000;
export const screenHeight = 833;