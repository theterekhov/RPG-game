import Player from './Player';
import Staff from './Staff';

export default class Mage extends Player {
  constructor(position, name) {
    super(position, name);
    this.weapon = new Staff();
  }
}
