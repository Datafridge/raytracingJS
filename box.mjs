import {Vec} from './vector.mjs';

class Box{
    constructor(min, max, Ia, kd, ks, n, reflection, kt, refraction_index, name) 
    {
      this.min = min || new Vec(-1,0,6); // A
      this.max = max || new Vec(1,2,8); // B
      this.position = (this.min.add(this.max)).divide(2);
      this.Ia = Ia || 0.2  // ambient
      this.kd = kd || new Vec(0.2,0.3,0.8); // diffuse coefficient
      this.ks = ks || new Vec(0.2,0.3,0.8); // specular coefficient
      this.n = n || 100;  // phong shininess
      this.reflection = reflection || 0.0; // reflectvity
      this.kt = kt || new Vec(0.3,0.3,0.3);
      this.refraction_index = refraction_index || 0.5; // index of refraction
      this.name = name || "box";
    }
  
    intersect(intersection_ray) 
    {
      let hit = 0;
      let normal = new Vec();

      let O = intersection_ray.position;
      let D = intersection_ray.direction.subtract(intersection_ray.position);
      let A = this.min;
      let B = this.max;

      let tXmin;
      let tXmax;
      let tYmin;
      let tYmax;
      let tZmin;
      let tZmax;

      if (D.x >= 0) 
      {
        tXmin = (A.x - O.x) / D.x;
        tXmax = (B.x - O.x) / D.x; 
      } 
      else 
      {
        tXmin = (B.x - O.x) / D.x;
        tXmax = (A.x - O.x) / D.x; 
      }
      if (D.y >= 0) 
      {
        tYmin = (A.y - O.y) / D.y;
        tYmax = (B.y - O.y) / D.y; 
      } 
      else
      {
        tYmin = (B.y - O.y) / D.y;
        tYmax = (A.y - O.y) / D.y; 
      }

      if ( (tXmin > tYmax) || (tYmin > tXmax) ) 
      {
        return {hit: 0, distance: -1, object:this};
      }
      if ( tYmin > tXmin ) tXmin = tYmin;
      if ( tYmax < tXmax ) tXmax = tYmax; 

      if (D.z >= 0) 
      {
        tZmin = (A.z - O.z) / D.z;
        tZmax = (B.z - O.z) / D.z; 
      } 
      else 
      {
        tZmin = (B.z - O.z) / D.z;
        tZmax = (A.z - O.z) / D.z; 
      }

      if ( (tXmin > tZmax) || (tZmin > tXmax)) 
      {
        return {hit: 0, distance: -1, object:this};
      }
      if ( tZmin > tXmin ) tXmin = tZmin;
      if ( tZmax < tXmax ) tXmax = tZmax; 

      hit = 1;
      let d = tXmin;

      let intersection_point = intersection_ray.position.add(((intersection_ray.direction.subtract(intersection_ray.position)).multiply(d)));
      let epsilon = 0.000001;

      if (Math.abs(intersection_point.x - this.min.x) < epsilon) 
      {
        normal = new Vec(-1,0,0);
      }
      else if (Math.abs(intersection_point.x - this.max.x) < epsilon) 
      {
        normal = new Vec(1,0,0);
      } 
      else if (Math.abs(intersection_point.y - this.min.y) < epsilon) 
      {
        normal = new Vec(0,-1,0);
      }
      else if (Math.abs(intersection_point.y - this.max.y) < epsilon) 
      {
        normal = new Vec(0,1,0);
      }
      else if (Math.abs(intersection_point.z - this.min.z) < epsilon)
      {
        normal = new Vec(0,0,-1);
      }
      else if (Math.abs(intersection_point.z - this.max.z) < epsilon) 
      {
        normal = new Vec(0,0,1);
      }

      return {hit: 1, distance: d, normal:normal, intersection_point: intersection_point, object: this};
    }
    
  }
  
  export { Box };
  