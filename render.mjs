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

	var camera = new Camera(new Vec(0,1,-3), new Vec(0,1,0), new Vec(0,1,0), 700, 700);
	camera.print();
	var sphere = new Sphere(new Vec(0,1,10), 2);

	var light = new Light(new Vec(2,10,10), new Vec(255,255,255));


	for (let h = 0; h < height; h++) {
		for (let w = 0; w < width; w++) {
			//construct the ray
			let ray = camera.primary_ray(w,h);

			index = (w * 4) + (h * width * 4);
			
			let intersection = sphere.intersect(ray);

			if((w===350&&h===350)||(w===325&&h===325)||(w===325&&h===375)||(w===375&&h===325)||(w===375&&h===375)) {ray.print();}

			let shadowray = new Ray();
			shadowray.position = ray.position.add(((ray.direction.subtract(ray.position)).multiply(ray.distance)).subtract(0.000000000001));
			
			shadowray.direction = light.position;

			let shadowintersection = sphere.intersect(shadowray);

			if((w===350&&h===350)||(w===325&&h===325)||(w===325&&h===375)||(w===375&&h===325)||(w===375&&h===375)) {shadowray.print();}

			if (intersection.hit === 1 && shadowintersection.hit === 0) {
				imageData.data[index + 0] = sphere.color.x;
    			imageData.data[index + 1] = sphere.color.y;
   		 		imageData.data[index + 2] = sphere.color.z;
				imageData.data[index + 3] = 255;
			}
			else if (intersection.hit === 1 && (shadowintersection.hit === 1 || shadowintersection.hit === -1)) {
				imageData.data[index + 0] = 0;
    			imageData.data[index + 1] = 0;
   		 		imageData.data[index + 2] = 0;
				imageData.data[index + 3] = 255;
			} else if (intersection.hit === 0) {
				imageData.data[index + 0] = 255;
    			imageData.data[index + 1] = 255;
   		 		imageData.data[index + 2] = 255;
				imageData.data[index + 3] = 255;
			} else if (intersection.hit === -1) {
				imageData.data[index + 0] = 0;
    			imageData.data[index + 1] = 255;
   		 		imageData.data[index + 2] = 0;
				imageData.data[index + 3] = 255;
			}
		}
	}

	ctx.putImageData(imageData, 0, 0);
}