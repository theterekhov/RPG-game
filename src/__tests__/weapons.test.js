import Weapon from '../js/Weapon';
import Arm from '../js/Arm';
import Bow from '../js/Bow';
import Sword from '../js/Sword';
import Knife from '../js/Knife';
import Staff from '../js/Staff';
import LongBow from '../js/LongBow';
import Axe from '../js/Axe';
import StormStaff from '../js/StormStaff';

const weapons = [
  {
    WeaponClass: Arm, name: 'Рука', attack: 1, durability: Infinity, range: 1,
  },
  {
    WeaponClass: Bow, name: 'Лук', attack: 10, durability: 200, range: 3,
  },
  {
    WeaponClass: Sword, name: 'Меч', attack: 25, durability: 500, range: 1,
  },
  {
    WeaponClass: Knife, name: 'Нож', attack: 5, durability: 300, range: 1,
  },
  {
    WeaponClass: Staff, name: 'Посох', attack: 8, durability: 300, range: 2,
  },
  {
    WeaponClass: LongBow, name: 'Длинный лук', attack: 15, durability: 200, range: 4,
  },
  {
    WeaponClass: Axe, name: 'Секира', attack: 27, durability: 800, range: 1,
  },
  {
    WeaponClass: StormStaff, name: 'Посох Бури', attack: 10, durability: 300, range: 3,
  },
];

describe.each(weapons)('$name', ({
  WeaponClass, name, attack, durability, range,
}) => {
  it('наследуется от Weapon', () => {
    expect(new WeaponClass()).toBeInstanceOf(Weapon);
  });

  it('имеет правильные характеристики', () => {
    const weapon = new WeaponClass();

    expect(weapon.name).toBe(name);
    expect(weapon.attack).toBe(attack);
    expect(weapon.durability).toBe(durability);
    expect(weapon.initDurability).toBe(durability);
    expect(weapon.range).toBe(range);
  });
});

describe('Наследование оружия', () => {
  it('длинный лук наследуется от лука', () => {
    expect(new LongBow()).toBeInstanceOf(Bow);
  });

  it('секира наследуется от меча', () => {
    expect(new Axe()).toBeInstanceOf(Sword);
  });

  it('посох бури наследуется от посоха', () => {
    expect(new StormStaff()).toBeInstanceOf(Staff);
  });

  it('рука не изнашивается', () => {
    const arm = new Arm();

    arm.takeDamage(20);

    expect(arm.durability).toBe(Infinity);
    expect(arm.getDamage()).toBe(1);
    expect(arm.isBroken()).toBe(false);
  });
});
