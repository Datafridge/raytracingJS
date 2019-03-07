import {Vec} from './vector.mjs';

class Light
{
  constructor(position, color) 
  {
    this.position = position || new Vec(5,-5,15);
    this.color = color || new Vec(1,1,1);
  } 
}
  
export { Light };