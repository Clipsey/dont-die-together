const gameConfig = {
    gameBounds: {
        x: 800,
        y: 600
    },
    times: {
        itemGenerate: 6,
        zombieGenerate: 2,
        zombieReload: 0.5,      //times in seconds
        pistolReload: 0.5,      
        zombieDie: 1
    },
    distances: {
        stagger: 6
    },
    damages: {
        zombie: 10,
        pistol: 40
    },
    speeds: {                   //speeds in pixels/second
        player: 50,
        bullet: 1000,
        zombie: 30
    },
    sizes: {
        player: 10,
        zombie: 12,
        bullets: 2
    }
}

export default gameConfig;

export const sampleState = {
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

const inputs = {
    up: false,
    down: false,
    right: true,
    left: true,
    fire: false,
    pointX: 24,
    pointY: -10
}