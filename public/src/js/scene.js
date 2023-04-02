import LaserGroup from "./laser.js";
import Meteor from "./meteors.js";

export default class SpaceScene extends Phaser.Scene {
  constructor() {
    super();

    this.ship;
    this.cursors;
    this.starField;
    this.backgroundSpeed = 12.5;
    this.playerSpeed = 200;
    this.laserGroup;
    this.meteorGroup;
    this.explosion;
    this.laserExplosion;
    this.meteorArray;
    this.gameOver = false;
    this.meteorSpawnSpeed = 1000;
    this.laserSound;
    this.shipExplosionSound,
    this.directHitSound;
  }

  preload() {
    this.load.image("space", "assets/images/background/back.png");
    this.load.spritesheet(
      "fighter",
      "assets/images/sprites/ships/spaceShipFlames.png",
      { frameWidth: 40, frameHeight: 100 }
    );

    this.load.image("redLaser", "assets/images/sprites/lasers/redLaser.png");

    this.load.image(
      "meteor",
      "assets/images/sprites/Meteors/spaceMeteors_001.png"
    );

    this.load.spritesheet(
      "explosion",
      "assets/images/sprites/Effects/explosion.png",
      { frameWidth: 128, frameHeight: 128 }
    );

    this.load.audio("laser", "assets/sounds/laser.wav");
    this.load.audio("shipExplosion", "assets/sounds/shipExplosion.mp3");
    this.load.audio("directHit", "assets/sounds/directHit.ogg");
  }

  create() {
    this.renderBackground();
    this.addShip();
    this.addShipControls();
    this.addAnimations();
    this.explosion = this.add.sprite(0, 0, "explosion");
    this.explosion.visible = false;
    this.laserGroup = new LaserGroup(this, "redLaser", 0, 0);
    this.laserSound = this.sound.add("laser");
    this.shipExplosionSound = this.sound.add("shipExplosion");
    this.directHit = this.sound.add("directHit");

    this.meteorGroup = this.physics.add.group();
    this.meteorArray = [];
    this.meteorTimedEvent = this.time.addEvent({
      delay: this.meteorSpawnSpeed,
      callback: this.addMeteor,
      callbackScope: this,
      loop: true,
    });

    this.physics.add.overlap(
      this.laserGroup,
      this.meteorGroup,
      this.handleMeteorShot,
      null,
      this
    );

    this.physics.add.collider(
      this.ship,
      this.meteorGroup,
      this.killShip,
      null,
      this
    );
  }

  update(time, delta) {
    this.moveBackground();
    this.controlShip();

    for (const meteor of this.meteorArray) {
      if (!meteor.isOrbiting()) {
        meteor.launch(this.ship.x, this.ship.y);
      }
      meteor.update(time, delta);
    }
  }

  renderBackground() {
    this.add.image(400, 300, "space");
    this.starField = this.add.tileSprite(600, 400, 1200, 800, "space");
  }

  moveBackground() {
    this.starField.tilePositionY -= this.backgroundSpeed;
  }

  addShip() {
    const centerX = this.cameras.main._width / 2;
    const bottom = this.cameras.main._height - 90;

    this.ship = this.physics.add.sprite(centerX, bottom, "fighter");
    this.ship.setCollideWorldBounds(true);
  }

  killShip(ship, meteor) {
    this.shipExplosionSound.play();
    this.explosion.x = ship.x;
    this.explosion.y = ship.y
    this.explosion.visible = true;
    this.explosion.anims.play('explode', true);
    this.cameras.main.shake(0.02, 250);
    this.physics.pause();
    ship.disableBody(true, true);
    this.gameOver = true;
    meteor.destroy();
  }

  addShipControls() {
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  controlShip() {
    if (this.cursors.space.isDown) {
      this.fireLaser();
    }
    if (this.cursors.up.isUp) {
      this.killThrusters();
    }

    if (this.cursors.left.isDown && this.cursors.up.isDown) {
      this.moveShipLeft();
      this.moveShipUp();
      this.engageThrusters();
      return;
    }
    if (this.cursors.left.isDown && this.cursors.down.isDown) {
      this.moveShipLeft();
      this.moveShipDown();
      return;
    }
    if (this.cursors.right.isDown && this.cursors.up.isDown) {
      this.moveShipRight();
      this.moveShipUp();
      this.engageThrusters();
      return;
    }
    if (this.cursors.right.isDown && this.cursors.down.isDown) {
      this.moveShipRight();
      this.moveShipDown();
      return;
    }
    if (this.cursors.right.isUp && this.cursors.left.isUp) {
      this.killLateralMovement();
    }
    if (this.cursors.up.isUp && this.cursors.down.isUp) {
      this.killHorizontalMovement();
    }
    if (this.cursors.left.isDown) {
      this.moveShipLeft();
      this.killHorizontalMovement();
    }
    if (this.cursors.right.isDown) {
      this.moveShipRight();
      this.killHorizontalMovement();
    }
    if (this.cursors.up.isDown) {
      this.moveShipUp();
      this.killLateralMovement();
      this.engageThrusters();
    }
    if (this.cursors.down.isDown) {
      this.moveShipDown();
      this.killLateralMovement();
    }
  }

  moveShipLeft() {
    this.ship.setVelocityX(-this.playerSpeed);
  }

  moveShipRight() {
    this.ship.setVelocityX(this.playerSpeed);
  }

  moveShipDown() {
    this.ship.setVelocityY(this.playerSpeed);
  }

  moveShipUp() {
    this.ship.setVelocityY(-this.playerSpeed);
  }

  fireLaser() {
    this.laserGroup.fireLaser(this.ship.x + 1, this.ship.y - 52);
    this.laserSound.play({
        rate: 2,
    });
  }

  killLateralMovement() {
    this.ship.setVelocityX(0);
  }

  killHorizontalMovement() {
    this.ship.setVelocityY(0);
  }

  killThrusters() {
    this.ship.anims.play("down", true);
  }

  engageThrusters() {
    this.ship.anims.play("up", true);
  }

  addAnimations() {
    this.anims.create({
      key: "down",
      frames: this.anims.generateFrameNumbers("fighter", {
        start: 0,
        end: 0,
      }),
      frameRate: 20,
      repeat: -1,
    });
    this.anims.create({
      key: "up",
      frames: this.anims.generateFrameNumbers("fighter", {
        start: 1,
        end: 2,
      }),
      frameRate: 20,
      repeat: -1,
    });
    this.anims.create({
        key: "explode",
        frames: this.anims.generateFrameNumbers("explosion", {
            start: 0,
            end: 15,
        }),
        frameRate: 30,
        repeat: 0,
    })
  }

  addMeteor() {
    if(this.meteorGroup.children.entries.length > 5)  return;

    let meteor = new Meteor(this, 200, 0, "meteor", 0);
    this.meteorGroup.add(meteor, true);
    this.meteorArray.push(meteor);
    
  }

  handleMeteorShot(laser, meteor) {
    this.directHit.play();
    meteor.destroy();
    laser.disableBody(true, true); // Disable the laser body and hide it from display

  }
}
