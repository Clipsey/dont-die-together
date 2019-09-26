const gameConfig = {
    gameBounds: {
        x: 800,
        y: 600
    },
    times: {
        itemGenerate: 6,
        zombieGenerate: 10,
        zombieReload: 0.5,      //times in seconds      
        zombieDie: 1,
        reload: {
            pistol: 0.5,
            rifle: 1,
            shotgun: 1
        }
    },
    distances: {
        stagger: 6
    },
    damages: {
        zombie: 10,
        pistol: 35,
        shotgun: 20,
        rifle: 50
    },
    speeds: {                   //speeds in pixels/second
        player: 50,
        bullet: 1000,
        zombie: 30
    },
    sizes: {
        item: 5,
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
            weapon: 'shotgun',
            ammo: 50,
            items: {
                guns: {
                    pistol: true,
                    shotgun: false,
                    rifle: false
                },
                gunAmmo: {
                    pistol: 10,
                    shotgun: 0,
                    rifle: 0
                }
            }
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
        0.456785546:{
            type: 'ammo',
            gun: 'shotgun',
            pos: { 
                x: 50,
                y: 50
            },
            amount: 10
        }
    },
    items: {
        0.456786546: {
            type: 'gun',
            gun: 'rifle',
            pos: {
                x: 50,
                y: 50
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