$(document).ready(function() {
  $("#intro").click(intro);
});

function intro(event) {
  //TODO: Delete old content
  //      Add new content
  event.preventDefault();
}

function simulation(event) {
  //TODO: Delete old content
  //      Add new content
  event.preventDefault();
}

function quiz(event) {
  //TODO: Delete old content
  //      Add new content
  event.preventDefault();
}

var defaultSketch = function(sketch) {
  sketch.setup = function () {
    sketch.createCanvas(1236, 800);
    sketch.smooth();
  };

  sketch.draw = function () {
    sketch.background(255);
    sketch.noFill();

    var warm = sketch.color(255, 0, 0);
    var cool = sketch.color(0, 0, 255);

    var startx = 800;
    var starty = 1000;
    var start_interx = 900;
    var start_intery = 700;

    var endx = 0;
    var endy = 10;
    var end_interx = 450;
    var end_intery = 682;

    var numArrows = 2;
    var numCurves = 10;
    var offset = 20;

    //curve that I want an object/sprite to move down
    //bezier(800, 0,1000,10,900,450,700,682);

    var t_base =  (sketch.frameCount/100.0)%1;

    //NO equal spacing, solution not trivial
    //http://imaginary-institute.com/resources/Tech%20Note%2008%20Equal%20Spacing%20Along%20Curves.pdf
    for (var c = 0; c < numCurves; c++) {
      //endx += c * offset;
      //end_interx += c * offset;
      startx += offset;
      starty += offset;
      start_interx += offset;
      start_intery += offset;

      for (var i = 0; i < numArrows; i++) {
        var t = (t_base + 1/(i + 1)) % 1;
        sketch.stroke(sketch.lerpColor(warm, cool, t));
        var x = sketch.bezierPoint(startx, starty, start_interx, start_intery, t);
        var y = sketch.bezierPoint(endx, endy, end_interx, end_intery, t);

        var ax = sketch.bezierTangent(startx, starty, start_interx, start_intery, t);
        var ay = sketch.bezierTangent(endx, endy, end_interx, end_intery, t);

        var a = sketch.atan2(ay, ax);
        sketch.drawArrow(x,y,30,a);
      }
    }
  };

  sketch.drawArrow = function(cx, cy, len, angle){
    sketch.push();
    sketch.translate(cx, cy);
    sketch.rotate(angle);
    sketch.strokeWeight(5);
    sketch.line(0,0,-len, 0);
    sketch.line(0, 0, -8, -8);
    sketch.line(0, 0, -8, 8);
    sketch.pop();
  };
};

var myp5 = new p5(defaultSketch, "content");
