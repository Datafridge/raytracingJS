import {Vec} from './vector.mjs';

class Light{
    constructor(position, radius) {
      this.position = position || new Vec(2,1,5);
      this.radius = radius || 2;
    }
  
    calc_light(normal){

    }  
  }
  
  export { Light };
  