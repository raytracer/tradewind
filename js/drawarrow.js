//Helper function to draw arrows, can be used in all sketches
var drawArrow = function(sketch, cx, cy, len, angle){
	sketch.push();
	sketch.translate(cx, cy);
	sketch.rotate(angle);
	sketch.strokeWeight(5);
	sketch.line(0,0,-len, 0);
	sketch.line(0, 0, -8, -8);
	sketch.line(0, 0, -8, 8);
	sketch.pop();
};
