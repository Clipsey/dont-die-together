const gameConfig = {
    gameBounds: {
        x: 800,
        y: 600
    },
    times: {
        pistolReload: 0.5,      //times in seconds
        zombieDie: 1
    },
    distances: {
        stagger: 6
    },
    damages: {
        pistol: 20
    },
    speeds: {                   //speeds in pixels/second
        player: 50,
        bullet: 1000,
        zombie: 40
    },
    sizes: {
        player: 10,
        zombie: 15,
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
            timeToFire: 0   //time until able to fire
        },
        2: {
            pos: {
                x: 200,
                y: 100
            },
            health: 50,
            timeToFire: 0
        }
    },
    enemies: {
        1: {
            type: 'zombie',
            pos: {
                x: 150,
                y: 300
            },
            health: 100
        },
        2: {
            type: 'zombie',
            pos: {
                x: 20,
                y: 30
            },
            health: 100
        }
    },
    bullets: {
        1: {
            type: 'pistol',
            pos: {
                x: 50,
                y: 220,
            },
            vel: {
                x: 150,
                y: 200
            }
        }
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