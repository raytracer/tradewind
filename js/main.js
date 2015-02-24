$(document).ready(function() {
	$("#content").append($("#intro-text").html());
	$("#intro").click(function(event) {
		$("#content").empty();
		$("#content").append($("#intro-text").html());
		event.preventDefault();
	});
	new Section("Sonnenstand", "#solarAltitude-text", sunSketch, quizSunAltitude);
	new Section("Luftdruck", "#konvektion-text", convectionSketch, quizdataConvection);
	new Section("Passatzirkulation","#lowPressure-text",circSketch, quizLowPressure);
	new Section("Corioliskraft","#coriolis-text", coriolisSketch, quizCoriolis);
	new Section("Nordostpassat","#passat-text",northEastSketch, quizCirculation)
});

var quizSunAltitude = {questions:[
		{
			text: "Wenn die Sonne an einem Ort im Zenit steht, ist die Energie der Sonnenstrahlen dort am...",
			correct: 0,
			answers: ["... höchsten.", "... niedrigsten."]
		},
		{
			text: "Wie oft steht die Sonne innerhalb eines Jahres am Äquator im Zenit?",
			correct: 2,
			answers: ["0","1","2","3","4"]
		},
		{
			text: "An welchen Breitengraden befinden sich die Wendekreise?",
			correct: 0,
			answers: ["23,5°N  und 23,5°S","41,7°N und  23,5°S","23,5°N und 41,7°S"]
		}
                                  
]};

var quizdataConvection = {questions: [
		{
			text: "Luft kühlt sich ab, beim ...",
			correct: 1,
			answers: ["Absteigen", "Aufsteigen"]
		},
		{
			text: "Wie bezeichnet man allgemein die horizontale Bewegung von Luft?",
			correct: 0,
			answers: ["Wind","Monsun","Föhn","Passat"]
		},
		{
			text: "Ein Hochdruckgebiet hat ... Luftteilchen.",
			correct: 0,
			answers: ["mehr","weniger"]
		}
		/*
		{
			text: "Welche Art von Luftaustausch verhindert die Passatinversion?",
			correct: 0,
			answers: ["vertikalen Luftaustausch", "horizontalen Luftaustausch", "diagonalen Luftaustausch"]
		}
		*/
]};
var quizLowPressure = {questions:[
	{
		text: "Die polwärts strömenden Luftmassen, sinken in (ungefähr) welchem Breitengrad wieder ab?",
		correct: 1,
		answers: ["15", "20", "30", "45"]
	},
	{
		text:"Die heftigen Gewittergüsse in der Äquatorialen Tiefdruckrinne werden wie genannt?",
		correct: 2,
		answers: ["Zenitsturm", "Kalmen", "Zenitalregen", "Rossbreiten", "Passatgewitter"]		
	},
	{
		text: "In den Hochdruckgebieten ist Himmel ...",
		correct: 0,
		answers: ["klar und wolkenlos","bewölkt", "nebelig", "bedeckt durch Gewitterwolken"]
	},
	{
		text: "Dort wo die Luftmassen absinken befinden sich der/die ...",
		correct: 2,
		answers: ["tropische Regenwald", "Trockensavanne", "Wüste"]
	}
]};
var quizCoriolis = {questions:[
    {
    	text: "Die Corioliskraft wird durch die ... erzeugt.",
    	correct: 1,
    	answers: ["Schiefstellung der Erde", "Erdrotation", "Erdumlaufbahn"]
    },
    {
    	text: "Die Erde dreht sich am Äquator ... als am Wendekreis",
    	correct: 1,
    	answers: ["langsamer","schneller"]
    },
    {
    	text: "In welche Richtung werden die Winde vom Norden Richtung Äquator abgelenkt?",
   		correct: 0,
   		answers: ["Rechts", "Links"]
    }
]};
var quizCirculation = {questions:[
    {
    	text: "Aus welcher Richtung weht der Passatwind auf der Nordhalbkugel?",
    	correct: 1,
    	answers: ["Norden","Osten","Süden","Westen"]
    },
    {
    	text: "Wo treffen sich Nordost- und Südostpassat?",
    	answers: 3,
    	answers:["Nordpol","Äquator","Südpol","ITC"]
    },
    {
    	text: "Die ITC zeichent sich am Boden durch folgende Merkmale aus:",
    	answers: 2,
    	answers:["extreme Trockenheit", "hohe Windgeschwindigkeiten", "regelmäßige, starke Niederschläge", "dicke Eisschichten"]
    }
    
]};
var Section = function(name, explanationid, sketch, quizdata) {
	this.explanationid = explanationid;
	this.sketch = sketch;
	this.quizdata = quizdata;
	var self = this;
	var simulationNode = $('<li role="presentation"><a href="#"></a></li>');
	var quizNode = simulationNode.clone();
	$("a", simulationNode).text(name + " - Erklärung");
	$("a", quizNode).text(name + " - Quiz");
	$("#navigation").append(simulationNode, quizNode);
  simulationNode.click(function (event) {
			self.simulation();
			event.preventDefault();
	});
  quizNode.click(function (event) {
			self.quiz();
			event.preventDefault();
	});
}

var currentSketch = undefined;

Section.prototype.simulation = function() {
  $("#content").empty();
  var explanationElem = $('<div id="explanation"></div>');
	explanationElem.append($(this.explanationid).html());
	$("#content").append(explanationElem);
	if (this.sketch === null) {
		explanationElem.addClass("col-md-9");
	} else {
		explanationElem.addClass("col-md-4");
		var simulationElem = $('<div id="simulation"></div>');
		simulationElem.addClass("col-md-5");
		$("#content").append(simulationElem);
	}
	
	if (currentSketch) currentSketch.mousePressed = function() {};
  currentSketch = new p5(this.sketch, "simulation");
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



