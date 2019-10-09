export const emptyState = {
    players: { },
    enemies: { },
    bullets: { },
    items: { }
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
            pistol: 100,
            shotgun: 8,
            rifle: 30
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