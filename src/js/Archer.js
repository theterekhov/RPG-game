import Player from './Player';
import Bow from './Bow';

export default class Archer extends Player {
  constructor(position, name) {
    super(position, name);
    this.weapon = new Bow();
  }
}
