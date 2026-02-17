export class LevelManager {
    constructor() {
        this.levels = [
            this.createLevel1(),
            this.createLevel2(),
            this.createLevel3(),
            this.createLevel4(),
            this.createLevel5(),
            this.createSecretLevel()
        ];
        this.REGULAR_LEVEL_COUNT = 5;
        this.SECRET_LEVEL_INDEX = 6;
    }

    getSecretLevelNumber() {
        return this.SECRET_LEVEL_INDEX;
    }
    
    getRegularLevelCount() {
        return this.REGULAR_LEVEL_COUNT;
    }

    createLevel1() {
        return {
            name: 'Level 1 - Getting Started',
            playerStartX: 50,
            playerStartY: 500,

            platforms: [
                // Ground
                { x: 0, y: 550, width: 800, height: 50, type: 'grass' },

                // Simple jumping section
                { x: 150, y: 480, width: 100, height: 20 },
                { x: 300, y: 430, width: 100, height: 20 },
                { x: 450, y: 380, width: 100, height: 20 },

                // Small pit with spikes
                { x: 600, y: 510, width: 80, height: 20, type: 'spike' },
                { x: 700, y: 480, width: 100, height: 20 },
            ],

            enemies: [
                { x: 200, y: 440, type: 'goomba' },
                { x: 500, y: 340, type: 'goomba' },
                { x: 750, y: 440, type: 'koopa' },
            ],

            collectibles: [
                { x: 200, y: 420, type: 'coin' },
                { x: 350, y: 380, type: 'coin' },
                { x: 500, y: 330, type: 'coin' },
                { x: 750, y: 420, type: 'coin' },
                { x: 750, y: 400, type: 'coin' },
            ],

            goal: { x: 700, y: 420, width: 40, height: 60 },
            pipes: [
                { x: 100, y: 510, width: 32, height: 40, isFake: true, fakeDamage: 10 },
                { x: 250, y: 510, width: 32, height: 40, isFake: false, targetLevel: 6, returnToLevel: 2 },
                { x: 620, y: 510, width: 32, height: 40, isFake: true, fakeDamage: 10 }
            ]
        };
    }

    createLevel2() {
        return {
            name: 'Level 2 - The Challenge',
            playerStartX: 50,
            playerStartY: 500,

            platforms: [
                // Ground
                { x: 0, y: 550, width: 800, height: 50, type: 'grass' },

                // Rising platforms
                { x: 100, y: 510, width: 80, height: 20 },
                { x: 200, y: 460, width: 80, height: 20 },
                { x: 300, y: 410, width: 80, height: 20 },
                { x: 400, y: 360, width: 80, height: 20 },

                // Descending platforms
                { x: 500, y: 410, width: 80, height: 20 },
                { x: 600, y: 460, width: 80, height: 20 },

                // Final jump
                { x: 700, y: 480, width: 100, height: 20 },

                // Spike trap
                { x: 250, y: 530, width: 60, height: 20, type: 'spike' },
            ],

            enemies: [
                { x: 150, y: 470, type: 'goomba' },
                { x: 300, y: 370, type: 'koopa' },
                { x: 500, y: 370, type: 'goomba' },
                { x: 700, y: 440, type: 'koopa' },
            ],

            collectibles: [
                { x: 150, y: 490, type: 'coin' },
                { x: 250, y: 440, type: 'coin' },
                { x: 350, y: 390, type: 'coin' },
                { x: 450, y: 340, type: 'coin' },
                { x: 550, y: 390, type: 'coin' },
                { x: 650, y: 440, type: 'coin' },
                { x: 750, y: 460, type: 'coin' },
                { x: 750, y: 440, type: 'coin' },
                { x: 750, y: 420, type: 'coin' },
            ],

            goal: { x: 700, y: 420, width: 40, height: 60 },
            pipes: [
                { x: 80, y: 510, width: 32, height: 40, isFake: true, fakeDamage: 10 },
                { x: 410, y: 510, width: 32, height: 40, isFake: false, targetLevel: 3 },
                { x: 560, y: 510, width: 32, height: 40, isFake: true, fakeDamage: 10 }
            ]
        };
    }
    
    createLevel3() {
        return {
            name: 'Level 3 - Castle Patrol',
            playerStartX: 50,
            playerStartY: 500,
            platforms: [
                { x: 0, y: 550, width: 800, height: 50, type: 'grass' },
                { x: 120, y: 500, width: 90, height: 20 },
                { x: 250, y: 455, width: 90, height: 20 },
                { x: 380, y: 410, width: 90, height: 20 },
                { x: 520, y: 455, width: 90, height: 20 },
                { x: 650, y: 500, width: 90, height: 20 },
                { x: 300, y: 530, width: 70, height: 20, type: 'spike' }
            ],
            enemies: [
                { x: 170, y: 470, type: 'goomba' },
                { x: 290, y: 425, type: 'runner' },
                { x: 430, y: 380, type: 'koopa' },
                { x: 560, y: 425, type: 'tank' },
                { x: 710, y: 470, type: 'jumper' }
            ],
            collectibles: [
                { x: 145, y: 470, type: 'coin' },
                { x: 275, y: 425, type: 'coin' },
                { x: 405, y: 380, type: 'coin' },
                { x: 545, y: 425, type: 'coin' },
                { x: 675, y: 470, type: 'coin' }
            ],
            goal: { x: 735, y: 450, width: 40, height: 60 },
            pipes: [
                { x: 90, y: 510, width: 32, height: 40, isFake: true, fakeDamage: 10 },
                { x: 455, y: 510, width: 32, height: 40, isFake: false, targetLevel: 4 },
                { x: 600, y: 510, width: 32, height: 40, isFake: true, fakeDamage: 10 }
            ]
        };
    }
    
    createLevel4() {
        return {
            name: 'Level 4 - Speed Run',
            playerStartX: 50,
            playerStartY: 500,
            platforms: [
                { x: 0, y: 550, width: 800, height: 50, type: 'grass' },
                { x: 100, y: 500, width: 70, height: 16 },
                { x: 200, y: 455, width: 70, height: 16 },
                { x: 300, y: 410, width: 70, height: 16 },
                { x: 420, y: 455, width: 70, height: 16 },
                { x: 540, y: 410, width: 70, height: 16 },
                { x: 670, y: 455, width: 90, height: 16 },
                { x: 260, y: 530, width: 60, height: 20, type: 'spike' },
                { x: 500, y: 530, width: 60, height: 20, type: 'spike' }
            ],
            enemies: [
                { x: 130, y: 470, type: 'runner' },
                { x: 245, y: 425, type: 'runner' },
                { x: 345, y: 380, type: 'jumper' },
                { x: 455, y: 425, type: 'runner' },
                { x: 585, y: 380, type: 'tank' },
                { x: 720, y: 425, type: 'koopa' }
            ],
            collectibles: [
                { x: 120, y: 475, type: 'coin' },
                { x: 220, y: 430, type: 'coin' },
                { x: 320, y: 385, type: 'coin' },
                { x: 440, y: 430, type: 'coin' },
                { x: 560, y: 385, type: 'coin' },
                { x: 700, y: 430, type: 'coin' }
            ],
            goal: { x: 740, y: 390, width: 40, height: 60 },
            pipes: [
                { x: 65, y: 510, width: 32, height: 40, isFake: true, fakeDamage: 10 },
                { x: 355, y: 510, width: 32, height: 40, isFake: false, targetLevel: 5 },
                { x: 615, y: 510, width: 32, height: 40, isFake: true, fakeDamage: 10 }
            ]
        };
    }
    
    createLevel5() {
        return {
            name: 'Level 5 - Boss Lane',
            playerStartX: 50,
            playerStartY: 500,
            platforms: [
                { x: 0, y: 550, width: 800, height: 50, type: 'grass' },
                { x: 120, y: 500, width: 80, height: 20 },
                { x: 250, y: 460, width: 80, height: 20 },
                { x: 380, y: 420, width: 80, height: 20 },
                { x: 520, y: 460, width: 80, height: 20 },
                { x: 660, y: 500, width: 100, height: 20 },
                { x: 330, y: 530, width: 80, height: 20, type: 'spike' }
            ],
            enemies: [
                { x: 170, y: 470, type: 'runner' },
                { x: 300, y: 430, type: 'tank' },
                { x: 430, y: 390, type: 'jumper' },
                { x: 720, y: 445, type: 'boss' }
            ],
            collectibles: [
                { x: 145, y: 470, type: 'coin' },
                { x: 275, y: 430, type: 'coin' },
                { x: 405, y: 390, type: 'coin' },
                { x: 545, y: 430, type: 'coin' },
                { x: 700, y: 470, type: 'coin' }
            ],
            goal: { x: 750, y: 440, width: 35, height: 60 },
            pipes: [
                { x: 95, y: 510, width: 32, height: 40, isFake: true, fakeDamage: 10 },
                { x: 560, y: 510, width: 32, height: 40, isFake: true, fakeDamage: 10 }
            ]
        };
    }

    createSecretLevel() {
        return {
            name: '⭐ Geheim Level - Coin Paradise',
            playerStartX: 50,
            playerStartY: 480,
            isSecret: true,

            platforms: [
                // Vloer
                { x: 0, y: 550, width: 800, height: 50, type: 'grass' },

                // Zigzag van kleine platforms vol munten
                { x: 80,  y: 480, width: 60, height: 16 },
                { x: 180, y: 440, width: 60, height: 16 },
                { x: 280, y: 400, width: 60, height: 16 },
                { x: 380, y: 360, width: 60, height: 16 },
                { x: 480, y: 400, width: 60, height: 16 },
                { x: 580, y: 440, width: 60, height: 16 },
                { x: 680, y: 400, width: 60, height: 16 },

                // Hoge platforms met bonus coins
                { x: 150, y: 320, width: 80, height: 16 },
                { x: 370, y: 280, width: 80, height: 16 },
                { x: 590, y: 300, width: 80, height: 16 },
            ],

            enemies: [
                // Geen vijanden — het is een paradise!
            ],

            collectibles: [
                // Coins op elk platform
                { x: 90,  y: 455, type: 'coin' },
                { x: 100, y: 455, type: 'coin' },
                { x: 110, y: 455, type: 'coin' },

                { x: 190, y: 415, type: 'coin' },
                { x: 200, y: 415, type: 'coin' },
                { x: 210, y: 415, type: 'coin' },

                { x: 290, y: 375, type: 'coin' },
                { x: 300, y: 375, type: 'coin' },
                { x: 310, y: 375, type: 'coin' },

                { x: 390, y: 335, type: 'coin' },
                { x: 400, y: 335, type: 'coin' },
                { x: 410, y: 335, type: 'coin' },

                { x: 490, y: 375, type: 'coin' },
                { x: 500, y: 375, type: 'coin' },
                { x: 510, y: 375, type: 'coin' },

                { x: 590, y: 415, type: 'coin' },
                { x: 600, y: 415, type: 'coin' },
                { x: 610, y: 415, type: 'coin' },

                { x: 690, y: 375, type: 'coin' },
                { x: 700, y: 375, type: 'coin' },
                { x: 710, y: 375, type: 'coin' },

                // Bonus coins op de hoge platforms
                { x: 160, y: 295, type: 'coin' },
                { x: 170, y: 295, type: 'coin' },
                { x: 180, y: 295, type: 'coin' },
                { x: 190, y: 295, type: 'coin' },
                { x: 200, y: 295, type: 'coin' },

                { x: 380, y: 255, type: 'coin' },
                { x: 390, y: 255, type: 'coin' },
                { x: 400, y: 255, type: 'coin' },
                { x: 410, y: 255, type: 'coin' },
                { x: 420, y: 255, type: 'coin' },

                { x: 600, y: 275, type: 'coin' },
                { x: 610, y: 275, type: 'coin' },
                { x: 620, y: 275, type: 'coin' },
                { x: 630, y: 275, type: 'coin' },
                { x: 640, y: 275, type: 'coin' },

                // Rij munten op de grond
                { x: 50,  y: 525, type: 'coin' },
                { x: 150, y: 525, type: 'coin' },
                { x: 250, y: 525, type: 'coin' },
                { x: 350, y: 525, type: 'coin' },
                { x: 450, y: 525, type: 'coin' },
                { x: 550, y: 525, type: 'coin' },
                { x: 650, y: 525, type: 'coin' },
                { x: 750, y: 525, type: 'coin' },
            ],

            goal: { x: 720, y: 350, width: 40, height: 60 },
            pipes: []
        };
    }

    getLevel(levelNumber) {
        return this.levels[levelNumber - 1] || this.levels[0];
    }

    getTotalLevels() {
        return this.levels.length;
    }
}
