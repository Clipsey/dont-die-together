const gameConfig = {
    speeds: {           //speeds in pixels/second
        player: 200,
        bullet: 300,
        zombie: 30
    },
    sizes: {
        player: 10,
        zombie: 15,
        bullets: 2
    }
}

export default gameConfig;

const sampleState = {
    players: {
        1: {
            pos: {
                x: 100,
                y: 100
            },
            health: 100
        },
        2: {
            pos: {
                x: 200,
                y: 100
            },
            health: 50
        }
    },
    enemies: {
        1: {
            type: 'zombie',
            pos: {
                x: 450,
                y: 450
            }
        }
    }
};