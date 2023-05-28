let curveyness = 0;
let s;
var canvas;

let lx = 100,ly, m = 0;
let focalLength = 100;

var R_INDEX = 1.49447654;

function setup() {
	canvas = createCanvas(windowWidth, windowHeight);
	s = createSlider(-10,30,1);
	ly = height/2-70;
	strokeCap(SQUARE);
	focalLength = width/6;
	//frameRate(10);
}

function draw() {
	background(51);

	drawScreen();


	// let next = get(lx+1,ly+m);
	// //console.log(next);
	// if (next[2] = 255 && next[3] == 255) {
	// 	t = getTangentLine(lx+1,ly+m);
	// 	if (t != null) {
	// 		t = createVector(t.x, t.y);
	// 		i = createVector(1, m);
	// 		d = p5.Vector.dot(t.normalize(), i.normalize());
	// 		angleDiff = map(d, -1, 1, 0, PI);
	// 		m = asin(sin(angleDiff)/R_INDEX);
	// 		//console.log(m);
	// 	}
	// }

	// lx++;
	// ly += m;
	// stroke(0,255,255);
	// point(lx,ly);

	curveyness = s.value();
	focalLength = width/6 *map(s.value(), -10, 30, 1, 0.3);
	//loadPixels(canvas);
	//updatePixels();

	//poi = getTangentLine(width/2,height/2-50);
	//line(poi.x, poi.y, width/2, height/2-50);

	//dir90 = createVector(100, 0)
	//dirMe = createVector(mouseX-width/2, mouseY-height/2);
	//d= p5.Vector.dot(dir90.normalize(), dirMe.normalize());
	//text(d + " " + map(d, -1, 1, 0, 180), 20, 20);
}

function drawScreen() {
	drawObject(mouseX, mouseY);
	//drawImage(mouseX, mouseY);

	drawLines();
	drawLens();
	drawPoints();

}

function drawPoints() {
	let w = width, h = height;
	push();
	stroke(255);
	fill(255);
	textSize(18);
	text("F", w/2+focalLength-3,h/2-20);
	text("F", w/2-focalLength-3,h/2-20);
	text("2F", w/2+2*focalLength-6,h/2-20);
	text("2F", w/2-2*focalLength-6,h/2-20);

	strokeWeight(7);
	point(w/2+focalLength,h/2);
	point(w/2-focalLength,h/2);
	point(w/2+2*focalLength,h/2);
	point(w/2-2*focalLength,h/2);
	pop();
}

function drawLines() {
	strokeWeight(2);
	stroke(250);
	let w = width, h = height;
	line(w/10,h/2,w-w/10,h/2);
	line(w/2,h/10,w/2,h-h/10);
}

function drawLens() {
	//noFill();
	strokeWeight(1);
	stroke(0,100,255);
	fill(0,100,255,100);
	let w = width, h = height;
 
	bezier(w/2,h/2-h/4,w/2-50-curveyness,h/2-50,w/2-50-curveyness,h/2+50,w/2,h/2+h/4);
	bezier(w/2,h/2-h/4,w/2+50+curveyness,h/2-50,w/2+50+curveyness,h/2+50,w/2,h/2+h/4);
}

function drawObject(x,y, empty=false) {
	x = constrain(x, width/10,width-width/10);
	y = constrain(y, height/4,height/4*3);
	
	let b = createVector(x, height/2);
	let v = createVector(0,y-height/2);
	let myColor = 'orange';
	drawArrow(b,v,myColor,false);

	drawImage(x,y);
}

function drawImage(x,y) {
	stroke(255);
	strokeWeight(1);

	let p0 = {x: width/2,y: y},
	p1 = {x: width/2+focalLength,y: height/2},
	p2 = {x: x,y: y},
	p3 = {x: width/2,y: height/2};

	let intersect = lineIntersects(p0,p1,p2,p3);

	if (intersect != null) { 
		//Parallel line
		line(x, y, width/2, y);
		line(width/2, y, intersect.x, intersect.y);
		//Center line
		line(x, y, intersect.x, intersect.y);

		let b = createVector(intersect.x, height/2);
		let v = createVector(0,intersect.y-height/2);
		let myColor = 'yellow';
		drawArrow(b,v,myColor, true);
	}


}

function drawArrow(base, vec, myColor, empty) {
	push();
	stroke(myColor);
	strokeWeight(3);
	if (!empty) fill(myColor);
	else noFill();
	translate(base.x, base.y);
	line(0, 0, vec.x, vec.y);
	rotate(vec.heading());
	let arrowSize = 7;
	translate(vec.mag() - arrowSize, 0);
	triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
	pop();
  }


function getTangentLine(x,y) {
	var px = 1;
	//console.log("Px starts at: ", px);
	i = y*width + x;
	let pAbove = {a:pixels[i-width+3],g:pixels[i-width+1],b:pixels[i+width+2]};
	let pBelow = {a:pixels[i+width+3],g:pixels[i+width+1],b:pixels[i+width+2]};

	if (pAbove.b == 255 && pAbove.a == 255) return {x: x+px, y: y-1};
	if (pBelow.b == 255 && pBelow.a == 255) return {x: x+px, y: y+1};
	
	while (px < width/2) {
		//console.log("Looking for tangent...");
		pAbove = get(x+px,y+1);
		pBelow = get(x+px,y-1);
	
		if (pAbove[2] == 255 && pAbove[3] == 255) return {x: x+px, y: y-1};
		if (pBelow[2] == 255 && pBelow[3] == 255) return {x: x+px, y: y+1};

		pAbove = get(x-px,y+1);
		pBelow = get(x-px,y-1);
		if (pAbove[2] == 255 && pAbove[3] == 255) return {x: x+px, y: y-1};
		if (pBelow[2] == 255 && pBelow[3] == 255) return {x: x+px, y: y+1};
		px += px/abs(px);
		px *= -1;
	}
	console.log("Nothing found");
	return null;
}


function lineIntersects(p0,p1,p2,p3) {
	var A1 = p1.y - p0.y,
		B1 = p0.x - p1.x,
		C1 = A1*p0.x + B1*p0.y;

	var A2 = p3.y - p2.y,
		B2 = p2.x - p3.x,
		C2 = A2*p2.x + B2*p2.y;

	var denominator = A1*B2 - A2*B1;
	if (denominator == 0) {
		return null;
	}

	return {
		x: (B2*C1 - B1*C2)/denominator,
		y: (A1*C2 - A2*C1)/denominator
	}
}