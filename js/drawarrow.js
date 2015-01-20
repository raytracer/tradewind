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

var drawCurve = function(sketch, x1, x2, x3, x4, y1, y2, y3, y4, numArrows) {
    var warm = sketch.color(255, 0, 0);
    var cool = sketch.color(0, 0, 255);

    var startx = x1;
    var starty = x2;
    var start_interx = x3;
    var start_intery = x4;

    var endx = y1;
    var endy = y2;
    var end_interx = y3;
    var end_intery = y4;

    var t_base =  (sketch.frameCount/100.0)%1;
    //NO equal spacing, solution not trivial
    //http://imaginary-institute.com/resources/Tech%20Note%2008%20Equal%20Spacing%20Along%20Curves.pdf
		for (var i = 0; i < numArrows; i++) {
			var t = (t_base + 1/(i + 1)) % 1;
			sketch.stroke(sketch.lerpColor(cool, warm, t));
			var x = sketch.bezierPoint(startx, starty, start_interx, start_intery, t);
			var y = sketch.bezierPoint(endx, endy, end_interx, end_intery, t);

			var ax = sketch.bezierTangent(startx, starty, start_interx, start_intery, t);
			var ay = sketch.bezierTangent(endx, endy, end_interx, end_intery, t);

			var a = sketch.atan2(ay, ax);
			drawArrow(sketch,x,y,30,a);
		}
}
