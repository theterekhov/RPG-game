import Mage from './Mage';
import StormStaff from './StormStaff';

export default class Demiurge extends Mage {
  constructor(position, name) {
    super(position, name);
    this.life = 80;
    this.magic = 120;
    this.attack = 6;
    this.luck = 12;
    this.description = 'Демиург';
    this.weapon = new StormStaff();
    this.maxLife = this.life;
    this.maxMagic = this.magic;
  }

  getDamage(distance) {
    const damage = super.getDamage(distance);

    if (this.magic > 0 && this.getLuck() > 0.6) {
      return damage * 1.5;
    }

    return damage;
  }
}
