import Player from './Player';
import Sword from './Sword';

export default class Warrior extends Player {
  constructor(position, name) {
    super(position, name);
    this.life = 120;
    this.speed = 2;
    this.description = 'Воин';
    this.weapon = new Sword();
    this.maxLife = this.life;
  }

  takeDamage(damage) {
    const isWounded = this.life < this.maxLife / 2;

    if (isWounded && this.magic > 0 && this.getLuck() > 0.8) {
      this.magic = Math.max(0, this.magic - damage);
      return;
    }

    super.takeDamage(damage);
  }
}
