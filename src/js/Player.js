import Arm from './Arm';
import Knife from './Knife';

export default class Player {
  constructor(position, name) {
    this.position = position;
    this.name = name;
    this.weapon = new Arm();
    this.knife = new Knife();
  }
}
