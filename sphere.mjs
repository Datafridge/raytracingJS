import {Vec} from './vector.mjs';

class Sphere{
    constructor(position, radius) {
      this.position = position || new Vec(0,1,10);
      this.radius = radius || 2;
    }
  
    intersect(ray) {
      let normal = new Vec();
      let epsilon = 0.002;
      let castray = ray.direction.subtract(ray.position);
      let a = castray.dot(castray);
      let origin_to_center_ray = ray.position.subtract(this.position);
      let b = origin_to_center_ray.dot(castray) * 2;
      let c = origin_to_center_ray.dot(origin_to_center_ray) - this.radius * this.radius;

      let d = b*b -4*a*c;
      ray.distance = d;
      if(d>0){
        d = Math.sqrt(d);
        let distance_1 = (-b - d)/(2*a);
        let distance_2 = (-b + d)/(2*a);
        if(distance_2 > epsilon)
        {
          if(distance_1 < epsilon) {
            if(distance_2 < epsilon) {
              ray.distance = distance_2;
              normal = castray.multiply(ray.distance).subtract(this.position).unit();
              return {hit: -1, normal: normal};
            }
          } else {
              ray.distance = distance_1;
              normal = castray.multiply(ray.distance).subtract(this.position).unit();
              return {hit: 1, normal: normal};
          }
        } 
      } 
  
      return {hit: 0, normal: normal, inout: "out"};     
    }
    
  }
  
  export { Sphere };
  