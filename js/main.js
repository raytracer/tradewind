$(document).ready(function() {
	new Section("ITC", "#intro-text", defaultSketch, quizdata);
});

var quizdata = {questions: [
		{
			text: "Luft kühlt sich ab, beim ...",
			correct: 1,
			answers: ["Absteigen", "Aufsteigen"]
		},
		{
			text: "Die polwärts strömenden Luftmassen, sinken in (ungefähr) welchem Breitengrad wieder ab?",
			correct: 2,
			answers: ["15", "20", "30", "45"]
		},
		{
			text: "Welche Art von Luftaustausch verhindert die Passatinversion?",
			correct: 0,
			answers: ["vertikalen Luftaustausch", "horizontalen Luftaustausch", "diagonalen Luftaustausch"]
		}
]};

var Section = function(name, introid, sketch, quizdata) {
	this.introid = introid;
	this.sketch = sketch;
	this.quizdata = quizdata;
	var self = this;
	var introNode = $('<li id="intro" role="presentation"><a href="#"></a></li>');
	var simulationNode = introNode.clone();
	var quizNode = introNode.clone();
	$("a", introNode).text(name + " - Einführung");
	$("a", simulationNode).text(name + " - Simulation");
	$("a", quizNode).text(name + " - Quiz");
	$("#navigation").append(introNode, simulationNode, quizNode);
  introNode.click(function (event) {
			self.intro();
			event.preventDefault();
	});
  simulationNode.click(function (event) {
			self.simulation();
			event.preventDefault();
	});
  quizNode.click(function (event) {
			self.quiz();
			event.preventDefault();
	});
}


Section.prototype.intro = function() {
  $("#content").empty();
  $("#content").append($(this.introid).html());
}

Section.prototype.simulation = function() {
  $("#content").empty();
  new p5(this.sketch, "content");
}

Section.prototype.quiz = function() {
  $("#content").empty();
  var source   = $("#quiz-template").html();
  var template = Handlebars.compile(source);
  var context = this.quizdata;
	for (var i = 0; i < context.questions.length; i++) {
		context.questions[i].name = "q" + i;
	}
  var html    = template(context);
  $("#content").append(html);
	$("form").submit(function(event) {
		var result = 0;
		for (var i = 0; i < context.questions.length; i++) {
			var q = context.questions[i];
			$("#" + q.name).removeClass("alert alert-danger");
			if ($("input:radio[name='" + q.name + "']:checked").val() !== q.answers[q.correct]) {
				result++;
				$("#" + q.name).addClass("alert alert-danger");
			}
		}

		if (result === 0) {
			alert("Alles richtig, bravo!");
		} else if (result === 1) {
			alert("Leider ist eine Antwort falsch.");
		} else {
			alert("Leider sind " + result + " Antworten falsch.");
		}

		event.preventDefault();
	});
}

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

var defaultSketch = function(sketch) {
  sketch.setup = function () {
    sketch.createCanvas(800, 600);
    sketch.smooth();
  };

  sketch.draw = function () {
    sketch.background(255);
    sketch.noFill();

    var warm = sketch.color(255, 0, 0);
    var cool = sketch.color(0, 0, 255);

    var startx = 100;
    var starty = 200;
    var start_interx = 200;
    var start_intery = 300;

    var endx = 0;
    var endy = 10;
    var end_interx = 400;
    var end_intery = 500;

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
        sketch.stroke(sketch.lerpColor(cool, warm, t));
        var x = sketch.bezierPoint(startx, starty, start_interx, start_intery, t);
        var y = sketch.bezierPoint(endx, endy, end_interx, end_intery, t);

        var ax = sketch.bezierTangent(startx, starty, start_interx, start_intery, t);
        var ay = sketch.bezierTangent(endx, endy, end_interx, end_intery, t);

        var a = sketch.atan2(ay, ax);
        drawArrow(sketch,x,y,30,a);
      }
    }
  };

};

