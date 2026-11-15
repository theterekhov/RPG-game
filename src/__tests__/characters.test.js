import Player from '../js/Player';
import Warrior from '../js/Warrior';
import Archer from '../js/Archer';
import Mage from '../js/Mage';
import Dwarf from '../js/Dwarf';
import Crossbowman from '../js/Crossbowman';
import Demiurge from '../js/Demiurge';
import Arm from '../js/Arm';
import Knife from '../js/Knife';
import Bow from '../js/Bow';
import Sword from '../js/Sword';
import LongBow from '../js/LongBow';
import Axe from '../js/Axe';
import StormStaff from '../js/StormStaff';
import play from '../js/game';

describe('Player', () => {
  let player;

  beforeEach(() => {
    player = new Player(5, 'Игрок');
    jest.spyOn(Math, 'random').mockReturnValue(0.5);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('создаётся с базовыми характеристиками', () => {
    expect(player.life).toBe(100);
    expect(player.magic).toBe(20);
    expect(player.speed).toBe(1);
    expect(player.attack).toBe(10);
    expect(player.agility).toBe(5);
    expect(player.luck).toBe(10);
    expect(player.description).toBe('Игрок');
    expect(player.weapon).toBeInstanceOf(Arm);
    expect(player.position).toBe(5);
    expect(player.name).toBe('Игрок');
  });

  it('считает удачу', () => {
    expect(player.getLuck()).toBe(0.6);
  });

  it('наносит урон в зависимости от расстояния', () => {
    expect(player.getDamage(1)).toBeCloseTo(6.6);
    expect(player.getDamage(2)).toBe(0);
  });

  it('получает урон и не опускает жизнь ниже нуля', () => {
    player.takeDamage(30);
    expect(player.life).toBe(70);
    expect(player.isDead()).toBe(false);
    player.takeDamage(100);
    expect(player.life).toBe(0);
    expect(player.isDead()).toBe(true);
  });

  it('двигается не быстрее своей скорости', () => {
    player.moveLeft(5);
    expect(player.position).toBe(4);
    player.moveRight(3);
    expect(player.position).toBe(5);
    player.move(-10);
    expect(player.position).toBe(4);
    player.move(2);
    expect(player.position).toBe(5);
  });

  it('блокирует атаку и уклоняется по удаче', () => {
    Math.random.mockReturnValue(0.95);
    expect(player.isAttackBlocked()).toBe(true);
    expect(player.dodged()).toBe(true);
  });

  it('при блоке страдает оружие', () => {
    player.isAttackBlocked = () => true;
    const { durability } = player.weapon;
    player.takeAttack(10);
    expect(player.life).toBe(100);
    expect(player.weapon.durability).toBe(durability);
  });

  it('при уклонении урон не проходит', () => {
    player.isAttackBlocked = () => false;
    player.dodged = () => true;
    player.takeAttack(10);
    expect(player.life).toBe(100);
  });

  it('получает урон, если не заблокировал и не уклонился', () => {
    player.isAttackBlocked = () => false;
    player.dodged = () => false;
    player.takeAttack(10);
    expect(player.life).toBe(90);
  });

  it('меняет сломанное оружие на следующее', () => {
    player.weapon.durability = 0;
    player.checkWeapon();
    expect(player.weapon).toBeInstanceOf(Knife);
    player.weapon.durability = 0;
    player.checkWeapon();
    expect(player.weapon).toBeInstanceOf(Arm);
  });

  it('выбирает противника с наименьшей жизнью', () => {
    const weak = new Player(1, 'Слабый');
    const strong = new Player(2, 'Сильный');
    weak.life = 10;

    expect(player.chooseEnemy([player, weak, strong])).toBe(weak);
  });

  it('возвращает null, если противников нет', () => {
    expect(player.chooseEnemy([player])).toBeNull();
  });

  it('движется к противнику', () => {
    const enemy = new Player(9, 'Враг');
    player.moveToEnemy(enemy);
    expect(player.position).toBe(6);
    player.position = 10;
    player.moveToEnemy(enemy);
    expect(player.position).toBe(9);
  });

  it('не бьёт, если оружие не достаёт', () => {
    const enemy = new Warrior(9, 'Воин');
    player.tryAttack(enemy);
    expect(enemy.life).toBe(120);
  });

  it('бьёт вплотную с удвоенным уроном', () => {
    const enemy = new Archer(5, 'Лучник');
    enemy.isAttackBlocked = () => false;
    enemy.dodged = () => false;
    player.weapon = new Sword();

    player.tryAttack(enemy);

    expect(enemy.position).toBe(6);
    expect(enemy.life).toBe(80 - 2 * ((10 + 25) * 0.6));
  });

  it('делает ход', () => {
    const enemy = new Warrior(7, 'Воин');
    enemy.isAttackBlocked = () => false;
    enemy.dodged = () => false;
    player.position = 6;
    player.weapon = new Sword();

    player.turn([player, enemy]);

    expect(player.position).toBe(7);
    expect(enemy.position).toBe(8);
    expect(enemy.life).toBeLessThan(120);
  });
});

describe('Персонажи', () => {
  beforeEach(() => {
    jest.spyOn(Math, 'random').mockReturnValue(0.5);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('воин имеет меч и повышенную жизнь', () => {
    const warrior = new Warrior(0, 'Воин');
    expect(warrior.life).toBe(120);
    expect(warrior.speed).toBe(2);
    expect(warrior.weapon).toBeInstanceOf(Sword);
    expect(warrior.description).toBe('Воин');
  });

  it('воин при малой жизни тратит ману вместо здоровья', () => {
    const warrior = new Warrior(0, 'Воин');
    warrior.life = 50;
    warrior.getLuck = () => 0.9;
    warrior.takeDamage(5);
    expect(warrior.life).toBe(50);
    expect(warrior.magic).toBe(15);
  });

  it('воин без маны получает урон в жизнь', () => {
    const warrior = new Warrior(0, 'Воин');
    warrior.life = 50;
    warrior.magic = 0;
    warrior.getLuck = () => 0.9;
    warrior.takeDamage(5);
    expect(warrior.life).toBe(45);
  });

  it('лучник бьёт дальше и зависит от дистанции', () => {
    const archer = new Archer(0, 'Лучник');
    expect(archer.weapon).toBeInstanceOf(Bow);
    expect(archer.getDamage(3)).toBeCloseTo(((5 + 10) * 0.6 * 3) / 3);
    expect(archer.getDamage(4)).toBe(0);
  });

  it('маг при высокой мане получает половинный урон', () => {
    const mage = new Mage(0, 'Маг');
    expect(mage.life).toBe(70);
    expect(mage.magic).toBe(100);
    mage.takeDamage(20);
    expect(mage.life).toBe(60);
    expect(mage.magic).toBe(88);
  });

  it('маг при низкой мане получает полный урон', () => {
    const mage = new Mage(0, 'Маг');
    mage.magic = 40;
    mage.takeDamage(10);
    expect(mage.life).toBe(60);
    expect(mage.magic).toBe(40);
  });

  it('гном усиливает удар', () => {
    const dwarf = new Dwarf(0, 'Гном');
    expect(dwarf.life).toBe(130);
    expect(dwarf.luck).toBe(20);
    expect(dwarf.weapon).toBeInstanceOf(Axe);
  });

  it('гном каждый шестой удар получает половину урона', () => {
    const dwarf = new Dwarf(0, 'Гном');
    dwarf.getLuck = () => 0.9;
    dwarf.takeDamage(10);
    dwarf.takeDamage(10);
    dwarf.takeDamage(10);
    dwarf.takeDamage(10);
    dwarf.takeDamage(10);
    expect(dwarf.life).toBe(80);
    dwarf.takeDamage(10);
    expect(dwarf.life).toBe(75);
  });

  it('арбалетчик усилен', () => {
    const crossbowman = new Crossbowman(0, 'Арбалетчик');
    expect(crossbowman.life).toBe(85);
    expect(crossbowman.weapon).toBeInstanceOf(LongBow);
    expect(crossbowman.description).toBe('Арбалетчик');
  });

  it('демиург усиливает урон при мане и удаче', () => {
    const demiurge = new Demiurge(0, 'Демиург');
    expect(demiurge.weapon).toBeInstanceOf(StormStaff);
    expect(demiurge.getDamage(1)).toBeCloseTo((6 + 10) * 0.62 * 1.5);
    demiurge.getLuck = () => 0.5;
    expect(demiurge.getDamage(1)).toBeCloseTo((6 + 10) * 0.5);
    demiurge.magic = 0;
    expect(demiurge.getDamage(1)).toBeCloseTo((6 + 10) * 0.5);
  });
});

describe('play', () => {
  it('проводит бой до победы', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0);
    const first = new Player(0, 'Первый');
    const second = new Player(1, 'Второй');
    first.life = 1;
    second.life = 1;
    first.attack = 100;

    expect(play([first, second])).toBe(first);
    jest.restoreAllMocks();
  });

  it('возвращает победителя', () => {
    const winner = new Warrior(0, 'Победитель');
    const loser = new Archer(1, 'Проигравший');
    loser.life = 0;

    expect(play([winner, loser])).toBe(winner);
  });
});
