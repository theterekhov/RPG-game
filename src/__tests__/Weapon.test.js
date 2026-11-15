import Weapon from '../js/Weapon';

describe('Weapon', () => {
  let weapon;

  beforeEach(() => {
    weapon = new Weapon('Старый меч', 20, 10, 1);
  });

  it('создаётся с переданными свойствами', () => {
    expect(weapon.name).toBe('Старый меч');
    expect(weapon.attack).toBe(20);
    expect(weapon.durability).toBe(10);
    expect(weapon.initDurability).toBe(10);
    expect(weapon.range).toBe(1);
  });

  it('получает повреждения', () => {
    weapon.takeDamage(5);
    expect(weapon.durability).toBe(5);
  });

  it('не опускает прочность ниже нуля', () => {
    weapon.takeDamage(50);
    expect(weapon.durability).toBe(0);
  });

  it('наносит полный урон при достаточной прочности', () => {
    expect(weapon.getDamage()).toBe(20);
  });

  it('наносит половинный урон при прочности ниже 30%', () => {
    weapon.takeDamage(8);
    expect(weapon.durability).toBe(2);
    expect(weapon.getDamage()).toBe(10);
  });

  it('наносит полный урон ровно при 30% прочности', () => {
    weapon.takeDamage(7);
    expect(weapon.getDamage()).toBe(20);
  });

  it('не наносит урон сломанным оружием', () => {
    weapon.takeDamage(10);
    expect(weapon.getDamage()).toBe(0);
  });

  it('сообщает о поломке', () => {
    expect(weapon.isBroken()).toBe(false);
    weapon.takeDamage(10);
    expect(weapon.isBroken()).toBe(true);
  });
});
