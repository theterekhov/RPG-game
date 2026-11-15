import Archer from './Archer';
import LongBow from './LongBow';

export default class Crossbowman extends Archer {
  constructor(position, name) {
    super(position, name);
    this.weapon = new LongBow();
  }
}
