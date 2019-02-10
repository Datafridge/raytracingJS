import {Vec} from './vector.mjs';

class Light{
  constructor(position, color) {
    this.position = position || new Vec(5,-5,15);
    this.color = color || new Vec(255,255,255);
  } 
}
  
export { Light };