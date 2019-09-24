const gameConfig = {
    speeds: {           //speeds in pixels/second
        player: 200,
        bullet: 300,
        enemy: 30
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
        zombies: {
            1: {
                pos: {
                    x: 150,
                    y: 300
                },
                health: 100
            },
            2: {
                pos: {
                    x: 20,
                    y: 450
                },
                health: 100
            }
        }
    }
};