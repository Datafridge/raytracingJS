import {Vec} from './vector.mjs';
import { Ray } from './ray.mjs';

class Sphere{
    constructor(position, radius, Ia, kd, ks, pr, n, ref) {
      this.position = position || new Vec(0,1,10);
      this.radius = radius || 1;
      this.Ia = Ia || 0.15  // ambient
      this.kd = kd || new Vec(0.3,1,0.4); // diffuse coefficient
      this.ks = ks || new Vec(0,0,0); // specular coefficient
      this.pr = pr || 0.2; // reflectvity
      this.n = n || 0.5;  // phong shininess
      this.ref = ref || 0.5; // index of refraction
    }
  
    intersect(intersection_ray, light) {
      let hit = 0;
      let normal = new Vec();
      let reflection_ray = null;
      let refraction_ray = null;

      let epsilon = 0.01;
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
          // inside
          if(distance_1 < epsilon) {
            if(distance_2 < epsilon) {
              intersection_ray.distance = distance_2;
              normal = castray.multiply(intersection_ray.distance).subtract(this.position).unit();
              return {hit: -1, normal: normal};
            }
          } else {
            // hit
              intersection_ray.distance = distance_1;
              //normal = castray.multiply(intersection_ray.distance).subtract(this.position).unit();
              
              hit = 1;
              let intersection_point = intersection_ray.position.add(((intersection_ray.direction.subtract(intersection_ray.position)).multiply(intersection_ray.distance)).subtract(0.001));
              normal = intersection_point.subtract(this.position).unit();

              //let normalray = new Ray(intersection_point, normal);
              //normalray.print();
              //calculate ambient part
              let ambient_color = this.kd.multiply(this.Ia);

              //calculate diffuse color
              let intersect_to_light = light.position.subtract(intersection_point).unit();
              let lDotNormal = intersect_to_light.dot(normal);
              
              lDotNormal = lDotNormal < 0 ? 0.0 : lDotNormal;
              //console.log(`lDotNormal: ${lDotNormal}`);

              let diffuse_color = light.color.multiply(this.kd).multiply(lDotNormal);
              
              //let diffuse_color = (light.color.multiply(this.kd).divide(255)).multiply(lDotNormal);
              //diffuse_color.print();


              //let total_color = (ambient_color.add(diffuse_color)).multiply(255*4);
              //if (diffuse_color.x > 255) diffuse_color.x = 255;
              //if (diffuse_color.y > 255) diffuse_color.y = 255;
              //if (diffuse_color.z > 255) diffuse_color.z = 255;

              let total_color = diffuse_color.add(ambient_color);

              //calculate reflection ray
              reflection_ray = new Ray(intersection_point, intersection_ray.direction.subtract(normal.multiply(intersection_ray.direction.dot(normal)).multiply(2)).unit());
              return {hit: 1, normal: normal, color: total_color.multiply(255), ray: intersection_ray, reflection_ray: reflection_ray, object:this, intersection_point: intersection_point}; 
          }
        } 
      } 
      // no hit
      return {hit: hit, normal: normal, color: new Vec(255,255,255), ray: intersection_ray, object:this};     
    }
    
  }
  
  export { Sphere };
  