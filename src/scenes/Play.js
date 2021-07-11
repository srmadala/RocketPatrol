class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    init(data) {
        this.highscore = data.highscore;
    }

    preload() {
        // load images/title sprites
        this.load.image('rocket', './assets/rocket.png');
        this.load.image('spaceship', './assets/spaceship.png');
        this.load.image('starfield', './assets/starfield.png');
        this.load.image('smallSpaceship', './assets/smallspaceship.png');
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
        this.p1Rocket = new Rocket(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'rocket').setOrigin(0.5, 0);
        // add spaceships (x3)
        this.ship01 = new Spaceship(this, game.config.width + borderUISize*6, borderUISize*4, 'spaceship', 0, 30).setOrigin(0, 0);
        this.ship02 = new Spaceship(this, game.config.width + borderUISize*3, borderUISize*5 + borderPadding*2, 'spaceship', 0, 20).setOrigin(0, 0);
        this.ship04 = new smallSpaceship(this, game.config.width + borderUISize*6, borderUISize*7 + borderPadding*2, 'smallSpaceship', 0, 40).setOrigin(0, 0);
        this.ship03 = new Spaceship(this, game.config.width, borderUISize*6 + borderUISize*4, 'spaceship', 0, 10).setOrigin(0, 0);
        // define keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
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
            fixedWidth: 70
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
            fixedWidth: 170
        }
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, this.p1Score, this.scoreConfig);
        // highscore
        this.display_highscore = this.add.text(125, borderUISize + borderPadding*2, 'Highscore: ', this.textConfig);
        this.display_highscore = this.add.text(300, borderUISize + borderPadding*2, this.highscore, this.scoreConfig);
        // GAME OVER flag
        this.gameOver = false;
        // 60-second play clock
        this.scoreConfig.fixedWidth = 0;
        this.time.delayedCall(5000, () => {this.ship01.moveSpeed=(this.ship01.moveSpeed*1.5)}, null, this); // delay in ms
        this.time.delayedCall(5000, () => {this.ship02.moveSpeed=(this.ship02.moveSpeed*1.5)}, null, this);  
        this.time.delayedCall(5000, () => {this.ship03.moveSpeed=(this.ship03.moveSpeed*3)}, null, this);  
        this.time.delayedCall(5000, () => {this.ship04.moveSpeed=(this.ship04.moveSpeed*2)}, null, this);  
        this.bonus_time = 0;
        // time left
        this.timeLeft = this.add.text(382, borderUISize + borderPadding*2, 'Time Left:', this.scoreConfig);
        this.timeLeft = this.add.text(550, borderUISize + borderPadding*2, game.settings.gameTimer, this.scoreConfig);
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
            this.shipExplode(this.ship03);
            this.bonus_time += 2000;
        }
        if (this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship02);
            this.bonus_time += 2000;
        }
        if (this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship01);
            this.bonus_time += 2000;
        }

        if (this.checkCollision(this.p1Rocket, this.ship04)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship04);
            this.bonus_time += 2000;
        }

        if(!this.gameOver) {
            this.p1Rocket.update();     // update p1
            this.ship01.update();      // update spaceship (x3)
            this.ship02.update();
            this.ship03.update();
            this.ship04.update();
        }
        // check key input for restart
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            if (this.p1Score > this.highscore) {
                this.highscore = this.p1Score;
            }
            this.scene.restart({ highscore: this.highscore });
            this.sound.play('back_music');
        }
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            if (this.p1Score > this.highscore) {
                this.highscore = this.p1Score;
            }
            this.scene.start("menuScene", { highscore: this.highscore });
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

    shipExplode(ship) {
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
        this.scoreLeft.text = this.p1Score;
        this.sound.play('sfx_explosion');
    }

}