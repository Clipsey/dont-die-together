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
        7: {
            topLeft: {
                x: 755,
                y: 63,
            },
            bottomRight: {
                x: 766,
                y: 125
            }
        },
        8: {
            topLeft: {
                x: 766,
                y: 63,
            },
            bottomRight: {
                x: 912,
                y: 71
            }
        },
        9: {
            topLeft: {
                x: 904,
                y: 73,
            },
            bottomRight: {
                x: 914,
                y: 211
            }
        },
        10: {
            topLeft: {
                x: 753,
                y: 160,
            },
            bottomRight: {
                x: 766,
                y: 218
            }
        },
        11: {
            topLeft: {
                x: 764,
                y: 211,
            },
            bottomRight: {
                x: 797,
                y: 220
            }
        },
        12: {
            topLeft: {
                x: 826,
                y: 210,
            },
            bottomRight: {
                x: 912,
                y: 221
            }
        },
        13: {
            topLeft: {
                x: 326,
                y: 263,
            },
            bottomRight: {
                x: 336,
                y: 547
            }
        },
        14: {
            topLeft: {
                x: 336,
                y: 263,
            },
            bottomRight: {
                x: 398,
                y: 272
            }
        },
        15: {
            topLeft: {
                x: 430,
                y: 263,
            },
            bottomRight: {
                x: 555,
                y: 272
            }
        },
        16: {
            topLeft: {
                x: 587,
                y: 263,
            },
            bottomRight: {
                x: 666,
                y: 272
            }
        },
        17: {
            topLeft: {
                x: 656,
                y: 273,
            },
            bottomRight: {
                x: 666,
                y: 548
            }
        },
        18: {
            topLeft: {
                x: 335,
                y: 540,
            },
            bottomRight: {
                x: 465,
                y: 548
            }
        },
        19: {
            topLeft: {
                x: 520,
                y: 540,
            },
            bottomRight: {
                x: 657,
                y: 548
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