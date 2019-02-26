import {Camera} from './camera.mjs';
import {Vec} from './vector.mjs';
import {Ray} from './ray.mjs';
import {Sphere} from './sphere.mjs';
import {Light} from './light.mjs';

var counter = 0;

var canvas = document.getElementById("renderCanvas");
var ctx = canvas.getContext("2d");

var width = 700;
var height = 700;

var imageData = ctx.createImageData(width, height);

var objects = [];
var index;

var camera = new Camera(new Vec(0,1,-3), new Vec(0,1,0), new Vec(0,1,0), 700, 700);
var sphere = new Sphere(new Vec(0,1,10), 2);

var light = new Light(new Vec(1,4,7), new Vec(1,1,1));

objects.push(sphere);


export function render () 
{
	for (let h = 0; h < height; h++) {
		for (let w = 0; w < width; w++) {

			let ray = camera.primary_ray(w,h);
			set_color(w,h,trace_ray(ray));
		}
	}

	ctx.putImageData(imageData, 0, 0);
}

function trace_ray(ray, depth) {
	let object_ = null;
	let pixel_color;

	// check all objects for intersection
	objects.forEach(function(object) {
		object_ = object.intersect(ray, light);
	});

	pixel_color = object_.color;

	// check if the intersection point is in the shadow
	/*if (object_.hit === 1) {
		let shadowray = new Ray(object_.intersection_point, light.position);

		if (counter%10000===1) {shadowray.print();}

		objects.forEach(function(object) {
			if (object.intersect(shadowray).hit === 1) { pixel_color = new Vec(0,0,0); };
		});
		counter++;
	}*/
	/*if (object.reflective)

		reflect_color = trace_ray( get_reflected_ray( original_ray, obj ) )

	if (object.refractive) {
		refract_color = trace_ray( get_refracted_ray( original_ray, obj ) )
	}*/

	//return ( combine_colors( point_color, reflect_color, refract_color ));
	return pixel_color;
}

function set_color(w,h,color) {
	index = (w * 4) + (h * width * 4);

	imageData.data[index + 0] = color.x;
	imageData.data[index + 1] = color.y;
	imageData.data[index + 2] = color.z;
	imageData.data[index + 3] = 255;
}