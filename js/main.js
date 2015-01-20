$(document).ready(function() {
	startSection = new Section("ITC", "#intro-text", convectionSketch, quizdata);
	new Section("ITC", "#intro-text", defaultSketch, quizdata);
	startSection.start();
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

Section.prototype.start = function() {
	this.intro();
}

var currentSketch = undefined;

Section.prototype.intro = function() {
  $("#content").empty();
  $("#content").append($(this.introid).html());
	if (currentSketch) currentSketch.mousePressed = function() {};
}

Section.prototype.simulation = function() {
  $("#content").empty();
	if (currentSketch) currentSketch.mousePressed = function() {};
  currentSketch = new p5(this.sketch, "content");
}

Section.prototype.quiz = function() {
  $("#content").empty();
	if (currentSketch) currentSketch.mousePressed = function() {};
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


var defaultSketch = function(sketch) {
  sketch.setup = function () {
    sketch.createCanvas(800, 600);
    sketch.smooth();
  };

  sketch.draw = function () {
    sketch.background(255);
    sketch.noFill();
		
		drawCurve(sketch,0,0,50,100,0,0,0,400,3);
  };

};



