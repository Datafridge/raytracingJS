import {Vec} from './vector.mjs';
import {Ray} from './ray.mjs';
 
export default class Camera{
  constructor(eye, at, up, resolution_width, resolution_height) {
    this.eye = eye || new Vec(0,1,0);
    this.at = at || new Vec(1,1,0);
    this.up = up || new Vec(0,1,0);
    this.resolution = {width: resolution_width, height: resolution_height} || {width: 700, height: 700};
    this.height = 2;
    this.width = 2;
    this.dir = this.at.subtract(this.eye);
    this.u = this.dir.cross(this.up).unit();
    this.v = this.u.cross(this.dir).unit();
    this.zero = this.at.subtract(this.u.multiply(1)).subtract(this.v.multiply(1));
    this.inc_y = (this.v.multiply(2).multiply(this.width/2)).divide(this.resolution.width);
    this.inc_x = (this.u.multiply(2).multiply(this.height/2)).divide(this.resolution.height);
  }

  primary_ray(x, y){
    let viewplane_point = this.zero.add(this.inc_x.multiply(x)).add(this.inc_y.multiply(y));
    //if((x===350&&y===350)||(x===0&&y===0)||(x===0&&y===699)||(x===699&&y===0)||(x===699&&y===699)) {viewplane_point.print();}
    let ray = new Ray(this.eye, viewplane_point);
    return ray;
  }

  print(){
    console.log(`camera \neye: x:${this.eye.x} y:${this.eye.y} z:${this.eye.z} \nat: x:${this.at.x} y:${this.at.y} z:${this.at.z}
    \nup: x:${this.up.x} y:${this.up.y} z:${this.up.z} \ndir: x:${this.dir.x} y:${this.dir.y} z:${this.dir.z}
    \nresolution: width:${this.resolution.width} height:${this.resolution.height} 
    \nzero: x:${this.zero.x} y:${this.zero.y} z:${this.zero.z} \nu: x:${this.u.x} y:${this.u.y} z:${this.u.z} \nv: x:${this.v.x} y:${this.v.y} z:${this.v.z}
    \ninc_x: x:${this.inc_x.x} y:${this.inc_x.y} z:${this.inc_x.z} \ninc_y: x:${this.inc_y.x} y:${this.inc_y.y} z:${this.inc_y.z}`);
  }
}
  
export { Camera }
  