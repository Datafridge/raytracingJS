import {Vec} from './vector.mjs';

export default class Camera{
  constructor(position, dir, up) {
    this.position = position || new Vec(0,0,-1);
    this.dir = dir || new Vec(0,0,1);
    this.up = up || new Vec(0,1,0);
  }

  ausgabe(){
    console.log("test");
  }
}
  
export { Camera }
  