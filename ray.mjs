import {Vec} from './vector.mjs';

class Ray{
    constructor(position, direction) {
      this.position = position || new Vec(0,0,0);
      this.direction = direction || new Vec(0,0,1);
      this.distance = 1000;
    }

    print() {
      //console.log(`pos (${this.position.x}, ${this.position.y}, ${this.position.z}) | dir (${this.direction.x}, ${this.direction.y}, ${this.direction.z})`);
      console.log(`Vector((${this.position.x}, ${this.position.y}, ${this.position.z}) , (${this.direction.x}, ${this.direction.y}, ${this.direction.z})) d${this.distance} `);
    }
  }
  
  export { Ray };
  