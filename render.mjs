import {Camera} from './camera.mjs';
import {Vec} from './vector.mjs';
import {Ray} from './ray.mjs';
import {Sphere} from './sphere.mjs';

export function render () 
{
	var canvas = document.getElementById("renderCanvas");
	var ctx = canvas.getContext("2d");

	var width = 700;
	var height = 700;

	var imageData = ctx.createImageData(width, height);

	var object = "box";
	var index, color;

	var camera = new Camera(new Vec(0,1,-5), new Vec(0,1,0), new Vec(0,1,0), 700, 700);
	camera.print();
	var sphere = new Sphere;

	for (let h = 0; h < height; h++) {
		for (let w = 0; w < width; w++) {
			//construct the ray
			let ray = camera.primary_ray(w,h);

			index = (w * 4) + (h * width * 4);
			
			let intersection = sphere.intersect(ray);

			if((w===350&&h===350)||(w===0&&h===0)||(w===0&&h===699)||(w===699&&h===0)||(w===699&&h===699)) {ray.print();}

			if (intersection.hit) {
				imageData.data[index + 0] = 0;
    			imageData.data[index + 1] = 0;
   		 		imageData.data[index + 2] = 0;
				imageData.data[index + 3] = 255;
			} else {
				imageData.data[index + 0] = 255;
    			imageData.data[index + 1] = 255;
   		 		imageData.data[index + 2] = 255;
				imageData.data[index + 3] = 255;
			}
				
		}
	}

	ctx.putImageData(imageData, 0, 0);
}