export const emptyState = {
    players: { },
    enemies: { },
    bullets: { },
    items: { }
};

export const newPlayer = {
    pos: {
        x: 100,
        y: 100
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
            pistol: 10,
            shotgun: 50,
            rifle: 1000
        }
    },
    ammo: 10,
}

export const canvasStyle = {
    display: 'block',
    backgroundColor: '#A9A9A9',
    marginLeft: 'auto',
    marginRight: 'auto'
};

export const screenWidth = 1200;
export const screenHeight = 800;