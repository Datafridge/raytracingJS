class Ray{
    constructor(position, direction) {
      this.position = position || Vec(0,0,0);
      this.radius = direction || Vec(0,0,1);
    }    
  }
  
  export { Ray };
  