import {Camera} from './camera.mjs';
import {Vec} from './vector.mjs';
import {Ray} from './ray.mjs';
import {Sphere} from './sphere.mjs';
import {Light} from './light.mjs';

export function render () 
{
	var canvas = document.getElementById("renderCanvas");
	var ctx = canvas.getContext("2d");

	var width = 700;
	var height = 700;

	var imageData = ctx.createImageData(width, height);

	var object = "sphere";
	var index, color;

	var camera = new Camera(new Vec(0,1,-10), new Vec(0,1,0), new Vec(0,1,0), 700, 700);
	camera.print();
	var sphere = new Sphere(new Vec(0,1,10), 1);

	var light = new Light(new Vec(0,-8,10), new Vec(255,255,255));


	for (let h = 0; h < height; h++) {
		for (let w = 0; w < width; w++) {
			//construct the ray
			let ray = camera.primary_ray(w,h);

			index = (w * 4) + (h * width * 4);
			
			let intersection = sphere.intersect(ray);

			if((w===350&&h===350)||(w===0&&h===0)||(w===0&&h===699)||(w===699&&h===0)||(w===699&&h===699)) {ray.print();}

			let shadowray = new Ray();
			shadowray.position = ray.position.add(ray.direction.multiply(ray.distance));
			shadowray.direction = light.position.subtract(shadowray.position).unit();

			let shadowintersection = sphere.intersect(shadowray);

			if((w===350&&h===350)||(w===300&&h===300)||(w===300&&h===400)||(w===400&&h===300)||(w===400&&h===400)) {shadowray.print();}

			if (intersection.hit === 1 && shadowintersection.hit === 0) {
				imageData.data[index + 0] = sphere.color.x;
    			imageData.data[index + 1] = sphere.color.y;
   		 		imageData.data[index + 2] = sphere.color.z;
				imageData.data[index + 3] = 255;
			}
			else if (intersection.hit === 1 && shadowintersection.hit === 1) {
				imageData.data[index + 0] = 0;
    			imageData.data[index + 1] = 0;
   		 		imageData.data[index + 2] = 0;
				imageData.data[index + 3] = 255;
			} else if (intersection.hit === 0) {
				imageData.data[index + 0] = 255;
    			imageData.data[index + 1] = 255;
   		 		imageData.data[index + 2] = 255;
				imageData.data[index + 3] = 255;
			}
				
		}
	}

	ctx.putImageData(imageData, 0, 0);
}