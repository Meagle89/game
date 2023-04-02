export default class Meteor extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture, frame) {
    super(scene, x, y, texture, frame);
    this.orbiting = false;
    this.direction = 0;
    this.speed = Phaser.Math.GetSpeed(150, .2);
    this.factor = 0;
  }

  launch(shipX, shipY) {
    this.setActive(true);
    this.setVisible(true);
    this.orbiting = true;
    let xOrigin = Phaser.Math.RND.between(0, 1200);
    let yOrigin = 0;
    this.setPosition(xOrigin, yOrigin);
    if (shipY > xOrigin) {
      let m = (shipY - yOrigin) / (shipX - xOrigin);
      this.direction = Math.atan(m);
    } else {
      this.factor = -1;
      let m = (shipY - yOrigin) / (xOrigin - shipX);
      this.direction = Math.atan(m);
    }
    this.angleRotation = Phaser.Math.RND.between(0.2, 0.9);
  }

  update(time, delta) {
    this.x += this.factor * Math.cos(this.direction) * this.speed * delta;
    this.y += Math.cos(this.direction) * this.speed * delta;
    this.angle += this.angleRotation;

    if (this.x < 0 || this.y < 0 || this.x > 1200 || this.y > 800) {
      this.setActive(false);
      this.setVisible(false);
      this.destroy();
    }
  }

  isOrbiting() {
    return this.orbiting;
  }

}

