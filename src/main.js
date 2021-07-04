// Sriharsha Madala
// Rocket Patrol Mods
// 7/3/2021
// All the mods together took me about 8 hours.

// Simultaneous two-player mode                                         -   30
// New smaller, faster spaceship                                        -   20
// Timing Mechanism that adds time to the clock for successful hits     -   20
// Time remaining (in seconds) on the screen                            -   10
// Allow the player to control the Rocket after it's fired              -   05
// Speed increase that happens after 30 seconds in the original game    -   05
// Copyright-free background music to the Play scene                    -   05
// Track a high score that persists across scenes and display in the UI -   05

// Total Points                                                         -   100

// Cites Sources
// I recieve help from the professor during his section for a some of the mods


let config = {
    type: Phaser.AUTO,
    width: 640,
    height: 480,
    scene: [ Menu, Play, Play2 ]
}
let game = new Phaser.Game(config);
// set UI sizes
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;

// reserve keyboard vars
let keyF, keyR, keyA, keyD, keyW, keyLEFT, keyRIGHT, keyUP;


