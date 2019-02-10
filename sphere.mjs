import {Vec} from './vector.mjs';

class Sphere{
    constructor(position, radius, color, kd, ks, pr, n, ref) {
      this.position = position || new Vec(0,1,10);
      this.radius = radius || 1;
      this.color = color || new Vec(255,0,0);
      this.kd = kd || 1.0; // diffuse coefficient
      this.ks = ks || 1.0; // specular coefficient
      this.pr = pr || 1.0; // reflectvity
      this.n = n || 0.5;  // phong shininess
      this.ref = ref || 0.5; // index of refraction
    }
  
    intersect(intersection_ray) {
      let normal = new Vec();
      let epsilon = 0.002;
      let castray = intersection_ray.direction.subtract(intersection_ray.position);
      let a = castray.dot(castray);
      let origin_to_center_ray = intersection_ray.position.subtract(this.position);
      let b = origin_to_center_ray.dot(castray) * 2;
      let c = origin_to_center_ray.dot(origin_to_center_ray) - this.radius * this.radius;

      let d = b*b -4*a*c;
      intersection_ray.distance = d;
      if(d>0){
        d = Math.sqrt(d);
        let distance_1 = (-b - d)/(2*a);
        let distance_2 = (-b + d)/(2*a);
        if(distance_2 > epsilon)
        {
          if(distance_1 < epsilon) {
            if(distance_2 < epsilon) {
              intersection_ray.distance = distance_2;
              normal = castray.multiply(intersection_ray.distance).subtract(this.position).unit();
              return {hit: -1, normal: normal};
            }
          } else {
              intersection_ray.distance = distance_1;
              normal = castray.multiply(intersection_ray.distance).subtract(this.position).unit();
              return {hit: 1, normal: normal};
          }
        } 
      } 
  
      return {hit: 0, normal: normal, inout: "out"};     
    }
    
  }
  
  export { Sphere };
  