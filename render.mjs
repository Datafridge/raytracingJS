import {Camera} from './camera.mjs';
import {Vec} from './vector.mjs';
import {Ray} from './ray.mjs';
import {Sphere} from './sphere.mjs';
import {Light} from './light.mjs';
import {Box} from './box.mjs';

var counter = 0;

var canvas = document.getElementById("renderCanvas");
var ctx = canvas.getContext("2d");

var width = 700;
var height = 700;

var imageData = ctx.createImageData(width, height);

var objects = [];
var index;

var camera = new Camera(new Vec(0,1,-3), new Vec(0,1,0), new Vec(0,1,0), 700, 700);
var sphere = new Sphere(new Vec(0,1,14), 2);
var floor = new Box(new Vec(-10,-2,0), new Vec(10,-0.5,18), 0.2, new Vec(0.1,0.9,0.2), new Vec(0.1,0.9,0.2), 0.2, 100, 0.5);
var sky = new Box(new Vec(-10,-2,18), new Vec(10,10,19), 0.2, new Vec(0.2,0.3,0.8), new Vec(0.2,0.3,0.8), 0.2, 100, 0.5);
//var box2 = new Box(new Vec(-4,-1,0), new Vec(4,0,10));
var box2 = new Box(new Vec(0.5,-1,0), new Vec(1,0.5,10));
var box3 = new Box(new Vec(-2,0,13), new Vec(1,2,15));

var light = new Light(new Vec(1,4,7), new Vec(1,1,1));

var background = new Vec(255,255,255);

objects.push(floor);
objects.push(sky);
//objects.push(box2);
//objects.push(box3);
objects.push(sphere);


export function render () 
{
	for (let h = 0; h < height; h++) {
		for (let w = 0; w < width; w++) {

			let ray = camera.primary_ray(w,h);
			set_color(w,h,trace_ray(ray).multiply(255));
		}
	}

	ctx.putImageData(imageData, 0, 0);
}

function trace_ray(ray, depth) {
	let intersection = {distance: 100000, color: background};
	let pixel_color;

	// check all objects for intersection
	objects.forEach(function(object) {
		let intersection_tmp = object.intersect(ray, light, camera);
		if (intersection_tmp.distance < intersection.distance && intersection_tmp.distance > 0) {
			intersection = intersection_tmp;
		}
	});
	
	/*if (object_.reflection_ray)
		reflect_color = trace_ray( get_reflected_ray( original_ray, obj ) )
	if (object_.refraction_ray != null) {
		refract_color = trace_ray(object_.refractive_ray)
	}*/

	let color_phong = intersection.distance === 10000 ? intersection.background : calc_phong(intersection.object, intersection.normal, intersection.intersection_point);

	pixel_color = color_phong;

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
	//let shadowray = new Ray(light.position,intersection_point);

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