import SpaceScene from "./scene.js";

var config = {
    type: Phaser.AUTO,
    width: 1200,
    height: 800,
    physics: {
      default: "arcade",
      arcade: {
        gravity: { y: 0, x: 0 },
        debug: false,
      },
    },
    scene: SpaceScene
  };

  var game = new Phaser.Game(config);
