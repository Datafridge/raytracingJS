import {Vec} from './vector.mjs';

class Sphere{
    constructor(position, radius, Ia, kd, ks, n, reflection, kt, refraction_index, name) 
    {
      this.position = position || new Vec(0,1,10);
      this.radius = radius || 1;
      this.Ia = Ia || 0.15  // ambient
      this.kd = kd || new Vec(0.3,1,0.4); // diffuse coefficient
      this.ks = ks || new Vec(0.3,1,0.4); // specular coefficient
      this.n = n || 100;  // phong shininess
      this.reflection = reflection || 0.2; // reflectvity
      this.kt = kt || new Vec(0.3,0.3,0.3);
      this.refraction_index = refraction_index || 0.5; // index of refraction
      this.name = name || "sphere";
    }

    intersect(intersection_ray) {
      let t0;
      let t1;
      let normal;
      let intersection_point;

      // find intersection
      let L = intersection_ray.position.subtract(this.position);
      let dir = intersection_ray.direction.subtract(intersection_ray.position);
      let a = dir.dot(dir);
      let b = dir.dot(L) * 2;
      let c = L.dot(L) - Math.pow(this.radius,2);
      
      let solution = solveQuadratic(a,b,c);
      if (solution.solution === true) {
        t0 = solution.x0;
        t1 = solution.x1;

        if (t0 < 0) {
          t0 = t1;
          if (t0 < 0) {
            return {hit: 0, distance: t0, object:this};  // --> behind sphere
          } else { // ---> inside
            let d = t0;
            let intersection_point = intersection_ray.position.add(((intersection_ray.direction.subtract(intersection_ray.position)).multiply(d)));
            let normal = intersection_point.subtract(this.position).negative().unit();
            return {hit: -1, normal: normal, intersection_point: intersection_point, distance: t0, object:this};
          }
        }

        let d = t0*0.9999;

        let intersection_point = intersection_ray.position.add(((intersection_ray.direction.subtract(intersection_ray.position)).multiply(d)));
        let normal = intersection_point.subtract(this.position).unit();

        return {hit: 1, normal: normal, intersection_point: intersection_point, distance: d, object:this}; 
      } else {
        return {hit: 0, normal: new Vec(0,0,0), intersection_point: new Vec(0,0,0), distance: -1, object:this}; 
      }

      
    } 
  }

  function solveQuadratic(a, b, c) {
    let x0;
    let x1;
    let discr = b * b - 4 * a * c;
    if (discr < 0) {
      return {solution: false};
    } else if (discr === 0) {
      x0 = - 0.5 * b / a;
      x1 = - 0.5 * b / a;
    } else {
      let q = (b > 0) ? -0.5 * (b + Math.sqrt(discr)) : -0.5 * (b - Math.sqrt(discr));
      x0 = q / a;
      x1 = c / q;
    }
    if (x0 > x1) {
      let tmp_x = x0;
      x0 = x1;
      x1 = tmp_x;
    }

    return {solution: true, x0: x0, x1: x1};
  } 
  
  export { Sphere };
  