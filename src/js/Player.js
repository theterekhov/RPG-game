import Arm from './Arm';
import Knife from './Knife';

export default class Player {
  constructor(position, name) {
    this.life = 100;
    this.magic = 20;
    this.speed = 1;
    this.attack = 10;
    this.agility = 5;
    this.luck = 10;
    this.description = 'Игрок';
    this.weapon = new Arm();
    this.position = position;
    this.name = name;
    this.maxLife = this.life;
    this.maxMagic = this.magic;
    this.weaponFallback = [Knife, Arm];
  }

  getLuck() {
    return (Math.random() * 100 + this.luck) / 100;
  }

  getDamage(distance) {
    if (distance > this.weapon.range) {
      return 0;
    }

    return ((this.attack + this.weapon.getDamage()) * this.getLuck()) / distance;
  }

  takeDamage(damage) {
    this.life = Math.max(0, this.life - damage);
  }

  isDead() {
    return this.life === 0;
  }

  moveLeft(distance) {
    this.position -= Math.min(distance, this.speed);
  }

  moveRight(distance) {
    this.position += Math.min(distance, this.speed);
  }

  move(distance) {
    if (distance < 0) {
      this.moveLeft(Math.abs(distance));
      return;
    }

    this.moveRight(distance);
  }

  isAttackBlocked() {
    return this.getLuck() > (100 - this.luck) / 100;
  }

  dodged() {
    return this.getLuck() > (100 - this.agility - this.speed * 3) / 100;
  }

  takeAttack(damage) {
    if (this.isAttackBlocked()) {
      this.weapon.takeDamage(damage);
      return;
    }

    if (this.dodged()) {
      return;
    }

    this.takeDamage(damage);
  }

  checkWeapon() {
    if (!this.weapon.isBroken()) {
      return;
    }

    const WeaponClass = this.weaponFallback.shift();

    if (WeaponClass) {
      this.weapon = new WeaponClass();
    }
  }

  tryAttack(enemy) {
    const distance = Math.max(1, Math.abs(this.position - enemy.position));

    if (distance > this.weapon.range) {
      return;
    }

    this.weapon.takeDamage(10 * this.getLuck());
    const damage = this.getDamage(distance);

    if (this.position === enemy.position) {
      enemy.moveRight(1);
      enemy.takeAttack(damage * 2);
    } else {
      enemy.takeAttack(damage);
    }

    this.checkWeapon();
  }

  chooseEnemy(players) {
    const enemies = players.filter((player) => player !== this && !player.isDead());

    if (enemies.length === 0) {
      return null;
    }

    return enemies.reduce((weakest, player) => (player.life < weakest.life ? player : weakest));
  }

  moveToEnemy(enemy) {
    if (this.position < enemy.position) {
      this.moveRight(this.speed);
      return;
    }

    if (this.position > enemy.position) {
      this.moveLeft(this.speed);
    }
  }

  turn(players) {
    const enemy = this.chooseEnemy(players);

    if (!enemy) {
      return;
    }

    this.moveToEnemy(enemy);
    this.tryAttack(enemy);
  }
}
