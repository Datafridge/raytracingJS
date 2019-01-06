import {Camera} from './camera.mjs';

//import {Camera} from './camera'
//import Ray from ray;

export function render () {
	var canvas = document.getElementById("renderCanvas");
	var ctx = canvas.getContext("2d");

	var imageData = ctx.createImageData(700, 700);
	console.log("length: " +  imageData.data.length);

	var object = "box";

	for (let h = 0; h < 700; h++) {
		for (let w = 0; w < 700; w++) {
		imageData.data[(h*w*3)+1] = 128;
		}
	}

	var camera = new Camera;

	ctx.putImageData(imageData, 0, 0);
}