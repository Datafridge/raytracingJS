import {Camera} from './camera.mjs';
import {Vec} from './vector.mjs';
import {Ray} from './ray.mjs';
import {Sphere} from './sphere.mjs';
import {Light} from './light.mjs';
import {Box} from './box.mjs';

var canvas = document.getElementById("renderCanvas");
var ctx = canvas.getContext("2d");

var width = 700;
var height = 700;

var imageData = ctx.createImageData(width, height);

var objects = [];
var index;

var depth = 6;

var camera = new Camera(new Vec(0,1,-3), new Vec(0,1,0), new Vec(0,1,0), 700, 700);
//var sphere = new Sphere(new Vec(0,1,14), 2, 0.15, new Vec(0.3,1,0.4), new Vec(0.3,1,0.4), 100, 0.2, new Vec(0.3,0.3,0.3), 1.5);
var sphere2 = new Sphere(new Vec(0,1,14), 2, 0.0, new Vec(0,0,0), new Vec(0,0,0), 100, 0.2, new Vec(1,1,1), 1.0);
var floor = new Box(new Vec(-10,-2,0), new Vec(10,-1,18), 0.2, new Vec(0.1,0.9,0.2), new Vec(0.1,0.9,0.2), 100, 0.2, new Vec(0.0,0.0,0.0), 1.0);
var earth = new Box(new Vec(-15,-2,0), new Vec(15,-1,40), 0.2, new Vec(0.5450,0.2705,0.0745), new Vec(0.2725,0.1335,0.0323), 100, 0.2, new Vec(0.0,0.0,0.0), 1.0);
var sky = new Box(new Vec(-20,-2,40), new Vec(20,30,41), 0.2, new Vec(0.2,0.3,0.8), new Vec(0.2,0.3,0.8), 100, 0.2, new Vec(0.0,0.0,0.0), 1.0);
//var box2 = new Box(new Vec(-4,-1,0), new Vec(4,0,10));
//var box2 = new Box(new Vec(0.5,-1,0), new Vec(1,0.5,10));
//var box3 = new Box(new Vec(-2,0,13), new Vec(1,2,15));

var light = new Light(new Vec(1,4,7), new Vec(1,1,1));

var background = new Vec(1,1,1);

//objects.push(floor);
objects.push(earth);
objects.push(sky);
//objects.push(box2);
//objects.push(box3);
//objects.push(sphere);
objects.push(sphere2);


export function render () 
{
	for (let h = 0; h < height; h++) {
		for (let w = 0; w < width; w++) {

			let ray = camera.primary_ray(w,h);
			set_color(w,h,trace_ray(ray, depth).multiply(255));
		}
	}

	ctx.putImageData(imageData, 0, 0);
}

function trace_ray(ray, depth) {
	depth--;
	let intersection = {distance: 100000, color: background};
	let pixel_color;

	// check all objects for intersection
	objects.forEach(function(object) {
		let intersection_tmp = object.intersect(ray, light, camera);
		if (intersection_tmp.distance < intersection.distance && intersection_tmp.distance > 0) {
			intersection = intersection_tmp;
		}
	});

	if (intersection.distance === 100000) return intersection.color;

	let color_phong = calc_phong(intersection.object, intersection.normal, intersection.intersection_point);

	pixel_color = color_phong;

	if (depth != 0) {	
		//secondary rays
		//let v = ray.position.subtract(ray.direction);
		let v = ray.direction.subtract(ray.position);		
		let intersection_point = intersection.intersection_point;
		let normal = intersection.normal;
		
		// reflection
		let reflection_ray = new Ray(intersection_point, (normal.multiply(v.dot(normal)).multiply(2).subtract(v)));
		let reflection_color = intersection.object.ks.multiply(trace_ray(reflection_ray, depth));

		let n1;
		let n2;

		// refraction
		if (intersection.hit === 1) {
			n1 = 1.0 // air
			n2 = intersection.object.refraction_index // glass
		} else if (intersection.hit === -1) {
			n1 = intersection.object.refraction_index // glass
			n2 = 1.0 // air
		}

		let angle1 = v.negative().dot(normal);
		let angle2 = 1 - Math.pow(n1,2)/Math.pow(n2,2) * (1 - Math.pow((v.dot(normal)),2));
		let refraction_ray = new Ray(intersection_point, (v.add(normal.multiply(angle1))).multiply(n1/n2).subtract(normal.multiply(angle2)));
		//let refraction_color = trace_ray(refraction_ray, depth).multiply(intersection.object.refraction_index);
		let refraction_color = intersection.object.kt.multiply(trace_ray(refraction_ray, depth));

		pixel_color = pixel_color.add(reflection_color).add(refraction_color);
	}


	return pixel_color;
}

function calc_phong(object, normal, intersection_point) {
	let total_color;
	
	// ambient part
	let ambient_color = object.kd.multiply(object.Ia);

	// diffuse part
	let intersect_to_light = light.position.subtract(intersection_point).unit();
	let lDotNormal = intersect_to_light.dot(normal);
	lDotNormal = lDotNormal < 0 ? 0.0 : lDotNormal;
	let diffuse_color = object.kd.multiply(lDotNormal);

	// specular part
	let reflected_intersect_to_light = normal.multiply(normal.dot(intersect_to_light) * 2).subtract(intersect_to_light).unit();
	let intersect_to_eye = camera.eye.subtract(intersection_point).unit();
	let specular_color = object.ks.multiply(Math.pow(intersect_to_eye.dot(reflected_intersect_to_light),object.n));

	// composition
	let shadowray = new Ray(intersection_point,light.position);

	// check all objects for intersection with the shadow ray
	let shadow = false;
	objects.forEach(function(object) {
		shadow = Math.abs(object.intersect(shadowray).hit) === 1 ? true : false;
	});

	if (shadow) {
		total_color = ambient_color;
	} else {
		total_color = (diffuse_color.add(specular_color).multiply(light.color)).add(ambient_color);
	}

	return total_color;
}

function set_color(w,h,color) {
	index = (w * 4) + (h * width * 4);

	imageData.data[index + 0] = color.x;
	imageData.data[index + 1] = color.y;
	imageData.data[index + 2] = color.z;
	imageData.data[index + 3] = 255;
}