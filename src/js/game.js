import Archer from './Archer';
import Warrior from './Warrior';
import Mage from './Mage';
import Dwarf from './Dwarf';
import Crossbowman from './Crossbowman';
import Demiurge from './Demiurge';

const characterClasses = [Warrior, Archer, Mage, Dwarf, Crossbowman, Demiurge];

export default function play(players = []) {
  const characters = characterClasses.map((Character) => new Character(0, Character.name));

  return [...characters, ...players];
}
