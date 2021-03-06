var canvas = document.getElementById("renderCanvas");
var ctx = canvas.getContext("2d");

var width = 700;
var height = 700;

var counter = 0;

var imageData = ctx.createImageData(width, height);

var objects = [];
var index;

var depth = 3;

var camera = new Camera(new Vec(0,1,-3), 
						new Vec(0,1,0), 
						new Vec(0,1,0), 
						700, 
						700);

var glass_sphere = new Sphere(	new Vec(0,1,14), 
								2, 
								0.0, 
								new Vec(0,0,0), 
								new Vec(0.8,0.8,0.8), 
								100, 
								0.2, 
								new Vec(0.8,0.8,0.8), 
								1.0);

var glass_box = new Box(new Vec(-2,-1,12), 
						new Vec(2,3,16), 
						0.0, 
						new Vec(0,0,0), 
						new Vec(0.8,0.8,0.8), 
						100, 0.2, 
						new Vec(0.8,0.8,0.8), 
						1.0);

var earth = new Box(new Vec(-80,-2,0), 
					new Vec(80,-1,40), 
					0.2, 
					new Vec(0.5,0.5,0.0), 
					new Vec(0.05,0.05,0.0), 
					2, 
					0.2, 
					new Vec(0.0,0.0,0.0), 
					1.0);

var light = new Light(	new Vec(1,4,7), 
						new Vec(1,1,1));

var background = new Vec(1,1,1);

function render () 
{

	// load all objects, depending on which object is selected
	objects = [];
	objects.push(earth);
	if(document.getElementById("object-select").value === "sphere") 
	{
		objects.push(glass_sphere);
	} else if (document.getElementById("object-select").value === "box") 
	{
		objects.push(glass_box);
	}

	// generate a ray for every pixel and trace them
	for (let h = 0; h < height; h++) 
	{
		for (let w = 0; w < width; w++) 
		{
			let ray = camera.primary_ray(w,h);
			set_color(w,h,trace_ray(ray, depth, w, h).multiply(255));
		}
	}

	// write the color to the canvas
	ctx.putImageData(imageData, 0, 0);
}

function trace_ray(ray, depth, w, h) 
{
	// read the dense values for the materials
	var nEnviroment = document.getElementById("n1In").value;
	var nObject = document.getElementById("n2In").value;

	depth--;
	var intersection = {distance: 10000000, color: background};
	let pixel_color = new Vec();

	// check all objects for intersection and choose the nearest
	objects.forEach(function(object) 
	{
		let intersection_tmp = object.intersect(ray, light, camera);
		if (intersection_tmp.distance < intersection.distance 
			&& intersection_tmp.distance > 0) 
		{
			intersection = intersection_tmp;
		}
	});

	if (intersection.distance === 10000000) return intersection.color;

	// calculate the phong part of the color
	let color_phong = calc_phong(intersection.object, 
								intersection.normal, 
								intersection.intersection_point);

	pixel_color = color_phong;

	if (depth != 0) {	
		//calculation of secondary rays

		let v = ray.direction.subtract(ray.position);		
		let intersection_point = intersection.intersection_point;
		let normal = intersection.normal;
		v = v.unit();
		
		// reflection
		let reflection_ray = new Ray(intersection_point.add(normal.multiply(0.005)), intersection_point.add((normal.multiply(v.negative().dot(normal)).multiply(2).add(v)).multiply(1000)));
		let reflection_color = intersection.object.ks.multiply(trace_ray(reflection_ray, depth, w, h));

		let n1;
		let n2;

		// choose right refraction values, based on in- or outside intersection
		if (intersection.hit === 1)
		{
			n1 = nEnviroment; 
			n2 = nObject; 
		} 
		else if (intersection.hit === -1) 
		{
			n1 = nObject; 
			n2 = nEnviroment;
		}
		if (n1 > n2) 
		{
			let tmp = n1;
			n1 = n2;
			n2 = tmp;
		}

		let angle1 = (v.negative().unit()).dot(normal);
		let angle2 = 1 - Math.pow(n1,2)/Math.pow(n2,2) 
					* (1 - Math.pow(((v.unit()).dot(normal)),2));
		angle2 = Math.sqrt(angle2);

		
		// refraction
		let refraction_ray;
		if (intersection.hit === 1) 
		{
			refraction_ray = new Ray(intersection_point.add((intersection.object.position.subtract(intersection_point)).unit().multiply(0.025)), intersection_point.add((((((v.unit()).add(normal.multiply(angle1))).multiply(n1/n2)).subtract(normal.multiply(angle2)))).multiply(1000)));
		}
		else if (intersection.hit === -1)
		{
			refraction_ray = new Ray(intersection_point.add((intersection_point.subtract(intersection.object.position)).unit().multiply(0.025)), intersection_point.add((((((v.unit()).add(normal.multiply(angle1))).multiply(n1/n2)).subtract(normal.multiply(angle2)))).multiply(1000)));
		}

		let refraction_color = intersection.object.kt.multiply(
								trace_ray(refraction_ray, depth, w, h));

		// Fresnel part
		let rho_parallel = ((n2 * angle1) - (n1 * angle2)) /
							 ((n2 * angle1) + (n1 * angle2));
		let rho_orthogonal = ((n1 * angle1) - (n2 * angle2)) /
							 ((n2 * angle1) + (n1 * angle2));
		let rho = (Math.pow(rho_parallel,2) + Math.pow(rho_orthogonal,2))/2;

		pixel_color = pixel_color.add(reflection_color.multiply(rho)).add(refraction_color.multiply(1-rho));
		
	}


	return pixel_color;
}

function calc_phong(object, normal, intersection_point) 
{
	let total_color;
	
	// ambient part
	let ambient_color = object.kd.multiply(object.Ia);

	// check all objects for intersection with the shadow ray
	let shadowray = new Ray(intersection_point,light.position);
	let shadow = false;
	objects.forEach(function(object) 
	{
		shadow = Math.abs(object.intersect(shadowray).hit) === 1 ? true : false;
	});

	if (shadow) 
	{
		total_color = ambient_color;
	} 
	else 
	{ 

		// diffuse part
		let intersect_to_light = light.position.subtract(intersection_point).unit();
		let lDotNormal = intersect_to_light.dot(normal);
		lDotNormal = lDotNormal < 0 ? 0.0 : lDotNormal;
		let diffuse_color = object.kd.multiply(lDotNormal);

		// specular part
		let reflected_intersect_to_light = normal.multiply(normal.dot(intersect_to_light) * 2).subtract(intersect_to_light).unit();
		let intersect_to_eye = camera.eye.subtract(intersection_point).unit();
		let specular_color = object.ks.multiply(Math.pow(intersect_to_eye.dot(reflected_intersect_to_light),object.n));

		total_color = (diffuse_color.add(specular_color).multiply(light.color)).add(ambient_color);
	}

	return total_color;
}

function set_color(w,h,color) 
{
	index = (w * 4) + (h * width * 4);

	imageData.data[index + 0] = color.x;
	imageData.data[index + 1] = color.y;
	imageData.data[index + 2] = color.z;
	imageData.data[index + 3] = 255;
}