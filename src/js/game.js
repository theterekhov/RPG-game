import Archer from './Archer';
import Warrior from './Warrior';
import Mage from './Mage';
import Dwarf from './Dwarf';
import Crossbowman from './Crossbowman';
import Demiurge from './Demiurge';

const maxRounds = 1000;
const squad = [
  [Warrior, 'Воин'],
  [Archer, 'Лучник'],
  [Mage, 'Маг'],
  [Dwarf, 'Гном'],
  [Crossbowman, 'Арбалетчик'],
  [Demiurge, 'Демиург'],
];

export function createPlayers() {
  return squad.map(([Character, name], index) => new Character(index * 2, name));
}

export default function play(players = createPlayers()) {
  let round = 0;

  while (players.filter((player) => !player.isDead()).length > 1 && round < maxRounds) {
    players.forEach((player) => {
      if (!player.isDead()) {
        player.turn(players);
      }
    });

    round += 1;
  }

  const winner = players.find((player) => !player.isDead()) || null;

  if (winner) {
    console.log(`Победитель: ${winner.name} (${winner.description})`);
  }

  return winner;
}
