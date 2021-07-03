class Play2 extends Phaser.Scene {
    constructor() {
        super("play2Scene");
    }

    init(data) {
        this.highscore = data.highscore;
    }

    preload() {
        // load images/title sprites
        this.load.image('rocket', './assets/rocket.png');
        this.load.image('rocket2', './assets/rocket2.png');
        this.load.image('spaceship', './assets/spaceship.png');
        this.load.image('starfield', './assets/starfield.png');
        this.load.image('smallSpaceship', './assets/smallSpaceship.png');
        // load spritesheet
        this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
    }

    create() {
        this.start_time = this.time.now;
        // background sound
        this.sound.play('back_music');
        // place tile sprites
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0);
        // green UI background
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x00FF00).setOrigin(0, 0);
        // white borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
        // add rocket (p1)
        this.p2Rocket = new Rocket(this, (game.config.width/2)+100, game.config.height - borderUISize - borderPadding, 'rocket').setOrigin(0.5, 0);
        // add rocket (p2)
        this.p1Rocket = new Rocket2(this, (game.config.width/2), game.config.height - borderUISize - borderPadding, 'rocket2').setOrigin(0.5, 0);
        // add spaceships (x3)
        this.ship01 = new Spaceship(this, game.config.width + borderUISize*6, borderUISize*4, 'spaceship', 0, 30).setOrigin(0, 0);
        this.ship02 = new Spaceship(this, game.config.width + borderUISize*3, borderUISize*5 + borderPadding*2, 'spaceship', 0, 20).setOrigin(0, 0);
        this.ship04 = new smallSpaceship(this, game.config.width + borderUISize*6, borderUISize*7 + borderPadding*2, 'smallSpaceship', 0, 40).setOrigin(0, 0);
        this.ship03 = new Spaceship(this, game.config.width, borderUISize*6 + borderUISize*4, 'spaceship', 0, 10).setOrigin(0, 0);
        // define keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        // animaiton config
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 9, first: 0}), frameRate: 30
        });
        // initalize score
        this.p1Score = 0;
        this.p2Score = 0;
        this.scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#Fb3141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5
            },
            fixedWidth: 75
        }
        this.textConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#Fb3141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5
            },
            fixedWidth: 40
        }
        this.scoreLeft1 = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, 'P1:', this.textConfig);
        this.scoreLeft1 = this.add.text(borderUISize + borderPadding + 40, borderUISize + borderPadding*2, this.p2Score, this.scoreConfig);
        this.scoreLeft2 = this.add.text(borderUISize + borderPadding + 120, borderUISize + borderPadding*2, 'P2:', this.textConfig);
        this.scoreLeft2 = this.add.text(borderUISize + borderPadding + 160, borderUISize + borderPadding*2, this.p1Score, this.scoreConfig);
        this.display_highscore = this.add.text(280, borderUISize + borderPadding*2, 'HS:', this.textConfig)
        this.display_highscore = this.add.text(320, borderUISize + borderPadding*2, this.highscore, this.scoreConfig);
        // GAME OVER flag
        this.gameOver = false;
        // 60-second play clock
        this.scoreConfig.fixedWidth = 0;
        this.time.delayedCall(5000, () => {this.ship01.moveSpeed=(this.ship01.moveSpeed*1.5)}, null, this); // delay in ms
        this.time.delayedCall(5000, () => {this.ship02.moveSpeed=(this.ship02.moveSpeed*1.5)}, null, this);  
        this.time.delayedCall(5000, () => {this.ship03.moveSpeed=(this.ship03.moveSpeed*3)}, null, this);  
        this.time.delayedCall(5000, () => {this.ship04.moveSpeed=(this.ship04.moveSpeed*2)}, null, this);  
        this.bonus_time = 0;
        this.timeLeft = this.add.text(402, borderUISize + borderPadding*2, 'Time Left:', this.scoreConfig);
        this.timeLeft = this.add.text(570, borderUISize + borderPadding*2, game.settings.gameTimer, this.scoreConfig);
    }

    update() {
        let time_accumulated = this.time.now - this.start_time;
        this.starfield.tilePositionX -= 4;
        if (time_accumulated >= game.settings.gameTimer + this.bonus_time) {
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', this.scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or ← for Menu', this.scoreConfig).setOrigin(0.5);
            this.gameOver = true;
        }
        let time_left;
        time_left = (game.settings.gameTimer + this.bonus_time - time_accumulated > 0) ? game.settings.gameTimer + this.bonus_time - time_accumulated : 0;
        time_left = Math.floor(time_left/1000);
        this.timeLeft.setText(time_left);
        // check collisions
        if(this.checkCollision(this.p1Rocket, this.ship03)) {
            this.p1Rocket.reset();
            this.shipExplode1(this.ship03);
            this.bonus_time += 2000;
        }
        if (this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.reset();
            this.shipExplode1(this.ship02);
            this.bonus_time += 2000;
        }
        if (this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Rocket.reset();
            this.shipExplode1(this.ship01);
            this.bonus_time += 2000;
        }

        if (this.checkCollision(this.p1Rocket, this.ship04)) {
            this.p1Rocket.reset();
            this.shipExplode1(this.ship04);
            this.bonus_time += 2000;
        }
        if(this.checkCollision(this.p2Rocket, this.ship03)) {
            this.p2Rocket.reset();
            this.shipExplode2(this.ship03);
            this.bonus_time += 2000;
        }
        if (this.checkCollision(this.p2Rocket, this.ship02)) {
            this.p2Rocket.reset();
            this.shipExplode2(this.ship02);
            this.bonus_time += 2000;
        }
        if (this.checkCollision(this.p2Rocket, this.ship01)) {
            this.p2Rocket.reset();
            this.shipExplode2(this.ship01);
            this.bonus_time += 2000;
        }

        if (this.checkCollision(this.p2Rocket, this.ship04)) {
            this.p2Rocket.reset();
            this.shipExplode2(this.ship04);
            this.bonus_time += 2000;
        }

        if(!this.gameOver) {
            this.p1Rocket.update();     // update p1
            this.p2Rocket.update();     // update p2
            this.ship01.update();      // update spaceship (x3)
            this.ship02.update();
            this.ship03.update();
            this.ship04.update();
        }
        // check key input for restart
        let winner = this.p1Score > this.p2Score ? this.p1Score : this.p2Score;
        console.log(winner);
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            if (winner > this.highscore) {
                this.highscore = winner;
            }
            this.scene.restart({ highscore: this.highscore });
            this.sound.play('back_music');
        }
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            if (winner > this.highscore) {
                this.highscore = winner;
            }
            this.scene.start("menuScene", { highscore: this.highscore, player: player1 });
            this.sound.play('back_music');
        }
    }

    checkCollision(rocket, ship) {
        // simple AABB checking
        if (rocket.x < ship.x + ship.width && rocket.x + rocket.width > ship.x && rocket.y < ship.y + ship.height && rocket.height + rocket.y > ship. y) {
            return true;
        } else {
            return false;
        }
    }

    shipExplode1(ship) {
        // temporarily hide ship
        ship.alpha = 0;
        // create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');             // play explode animation
        boom.on('animationcomplete', () => {    // callback after anim completes
          ship.reset();                         // reset ship position
          ship.alpha = 1;                       // make ship visible again
          boom.destroy();                       // remove explosion sprite
        });
        // score add and repraint
        this.clock += 5000;
        this.p1Score += ship.points;
        this.scoreLeft1.text = this.p1Score;
        this.sound.play('sfx_explosion');
    }
    shipExplode2(ship) {
        // temporarily hide ship
        ship.alpha = 0;
        // create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');             // play explode animation
        boom.on('animationcomplete', () => {    // callback after anim completes
          ship.reset();                         // reset ship position
          ship.alpha = 1;                       // make ship visible again
          boom.destroy();                       // remove explosion sprite
        });
        // score add and repraint
        this.clock += 5000;
        this.p2Score += ship.points;
        this.scoreLeft2.text = this.p2Score;
        this.sound.play('sfx_explosion');
    }

}