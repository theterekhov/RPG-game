import Warrior from './Warrior';
import Axe from './Axe';

export default class Dwarf extends Warrior {
  constructor(position, name) {
    super(position, name);
    this.weapon = new Axe();
  }
}
