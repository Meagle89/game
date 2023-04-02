class Laser extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture, frame) {
    super(scene, x, y, texture, frame);
    this.speed = 900;
  }

  fire(x, y) {
    this.body.reset(x, y);
    this.setActive(true);
    this.setVisible(true);
    this.setVelocityY(-this.speed);
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);
    if (this.y <= 0) {
      this.setActive(false);
      this.setVisible(false);
    }
  }

  bullsEye(x, y) {
    this.body.reset(x, y);
    this.setActive(false);
    this.setVisible(false);
  }
}

export default class LaserGroup extends Phaser.Physics.Arcade.Group {
  constructor(scene, key, frame) {
    super(scene.physics.world, scene);
    this.createMultiple({
      key: key,
      frame: frame,
      active: false,
      visible: false,
      classType: Laser,
      frameQuantity: 3,
    });
  }

  fireLaser(x, y) {
    let laser = this.getFirstDead(false);
    if (laser) {
      laser.fire(x, y);
    }
  }
}
