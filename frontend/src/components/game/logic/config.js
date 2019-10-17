const gameConfig = {
    gameBounds: {
        x: 1200,
        y: 800
    },
    numbers: {
        zombieAnimatePics: 6
    },
    times: {
        sounds: 0.25,
        playerMessage: 0.5,
        playerSpawn: 20,
        zombieAnimateTime: 10,
        itemGenerate: 10,
        zombieGenerate: 3,
        zombieReload: 0.5,      //times in seconds      
        zombieDie: 10,
        zombieSwitchDir: 0.5,
        switchGuns: 0.25,
        reload: {
            pistol: 0.5,
            rifle: 0.1,
            shotgun: 1
        }
    },
    distances: {
        stagger: 15
    },
    damages: {
        zombie: 10,

        pistol: 35,
        shotgun: 34,
        rifle: 35
    },
    speeds: {                   //speeds in pixels/second
        player: 150,
        bullet: 1500,
        zombie: 20
    },
    acceleration: {
        player: 100000             //acc in pixels/second/second
    },
    sizes: {
        item: 5,
        player: 10,
        zombie: 10,
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
            velocity: {
                x: 0,
                y: 0
            },
            health: 100,
            timeToFire: 0,   //time until able to fire
            timeToSwitch: 0,
            weapon: 'shotgun',
            ammo: 10,
            items: {
                guns: {
                    pistol: true,
                    shotgun: true,
                    rifle: true
                },
                gunAmmo: {
                    pistol: 10,
                    shotgun: 10,
                    rifle: 10
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
        },
        0.456786546: {
            type: 'gun',
            gun: 'rifle',
            pos: {
                x: 50,
                y: 50
            }
        },
        0.456786546: {
            type: 'medPack',
            amount: 30,
            pos: {
                x: 50,
                y: 50
            }
        }
    },
    obstacles: {
        0.455786546: {
            type: 'rocks',
            topLeft: {
                x: 30,
                y: 100,
            },
            bottomRight: {
                x: 50,
                y: 150,
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