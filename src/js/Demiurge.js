import Mage from './Mage';
import StormStaff from './StormStaff';

export default class Demiurge extends Mage {
  constructor(position, name) {
    super(position, name);
    this.weapon = new StormStaff();
  }
}
