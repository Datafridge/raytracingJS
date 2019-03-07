// derived from https://gist.github.com/winduptoy/a1aa09c3499e09edbd33
// thanks a lot to winduptoy
export default class Vec{
  constructor(x, y, z) {
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
  }

  negative() {
    return new Vec(-this.x, -this.y, -this.z);
  }

  add(v) {
    if (v instanceof Vec) {
      return new Vec(this.x + v.x, this.y + v.y, this.z + v.z);
    } else {
      return new Vec(this.x + v, this.y + v, this.z + v);
    }
  }

  subtract(v) {
    if (v instanceof Vec) {
      return new Vec(this.x - v.x, this.y - v.y, this.z - v.z);
    } else {
      return new Vec(this.x - v, this.y - v, this.z - v);
    }
  }

  multiply(v) {
    if (v instanceof Vec) {
      return new Vec(this.x * v.x, this.y * v.y, this.z * v.z);
    } else {
      return new Vec(this.x * v, this.y * v, this.z * v);
    }
  }

  divide(v) {
    if (v instanceof Vec) {
      return new Vec(this.x / v.x, this.y / v.y, this.z / v.z);
    } else {
      return new Vec(this.x / v, this.y / v, this.z / v);
    }
  }

  equals(v) {
    return this.x === v.x && this.y === v.y && this.z === v.z;
  }

  dot(v) {
    return this.x * v.x + this.y * v.y + this.z * v.z;
  }

  cross(v) {
    return new Vec(
      this.y * v.z - this.z * v.y,
      this.z * v.x - this.x * v.z,
      this.x * v.y - this.y * v.x
    );
  }

  length() {
    return Math.sqrt(this.dot(this));
  }

  unit() {
    return this.divide(this.length());
  }

  min() {
    return Math.min(Math.min(this.x, this.y), this.z);
  }

  max() {
    return Math.max(Math.max(this.x, this.y), this.z);
  }

  toAngles() {
    return {
      theta: Math.atan2(this.z, this.x),
      phi: Math.asin(this.y / this.length())
    };
  }

  angleTo(a) {
    return Math.acos(this.dot(a) / (this.length() * a.length()));
  }

  toArray(n) {
    return [this.x, this.y, this.z].slice(0, n || 3);
  }

  clone() {
    return new Vec(this.x, this.y, this.z);
  }

  init(x, y, z) {
    this.x = x; this.y = y; this.z = z;
    return this;
  }

  print() {
    console.log(`vec x:${this.x} y:${this.y} z:${this.z}`);
  }

  static negative(a, b) {
    b.x = -a.x; b.y = -a.y; b.z = -a.z;
    return b;
  }

  static add(a, b, c) {
    if (b instanceof Vec) {
      c.x = a.x + b.x; c.y = a.y + b.y; c.z = a.z + b.z;
    } else {
      c.x = a.x + b; c.y = a.y + b; c.z = a.z + b;
    }
    return c;
  }

  static subtract(a, b, c) {
    if (b instanceof Vec) {
      c.x = a.x - b.x; c.y = a.y - b.y; c.z = a.z - b.z;
    } else {
      c.x = a.x - b; c.y = a.y - b; c.z = a.z - b;
    }
    return c;
  }

  static multiply(a, b, c) {
    if (b instanceof Vec) {
      c.x = a.x * b.x; c.y = a.y * b.y; c.z = a.z * b.z;
    } else {
      c.x = a.x * b; c.y = a.y * b; c.z = a.z * b;
    }
    return c;
  }

  static divide(a, b, c) {
    if (b instanceof Vec) {
      c.x = a.x / b.x; c.y = a.y / b.y; c.z = a.z / b.z;
    } else {
      c.x = a.x / b; c.y = a.y / b; c.z = a.z / b;
    }
    return c;
  }

  static cross(a, b, c) {
    c.x = a.y * b.z - a.z * b.y;
    c.y = a.z * b.x - a.x * b.z;
    c.z = a.x * b.y - a.y * b.x;
    return c;
  }

  static unit(a, b) {
    const length = a.length();
    b.x = a.x / length;
    b.y = a.y / length;
    b.z = a.z / length;
    return b;
  }

  static fromAngles(theta, phi) {
    return new Vec(Math.cos(theta) * Math.cos(phi), Math.sin(phi), Math.sin(theta) * Math.cos(phi));
  }

  static randomDirection() {
    return Vec.fromAngles(Math.random() * Math.PI * 2, Math.asin(Math.random() * 2 - 1));
  }

  static min(a, b) {
    return new Vec(Math.min(a.x, b.x), Math.min(a.y, b.y), Math.min(a.z, b.z));
  }

  static max(a, b) {
    return new Vec(Math.max(a.x, b.x), Math.max(a.y, b.y), Math.max(a.z, b.z));
  }

  static lerp(a, b, fraction) {
    return b.subtract(a).multiply(fraction).add(a);
  }

  static fromArray(a) {
    return new Vec(a[0], a[1], a[2]);
  }

  static angleBetween(a, b) {
    return a.angleTo(b);
  }
}

export { Vec };
