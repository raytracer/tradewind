$(document).ready(function() {
	new Section("ITC", "#intro-text", convectionSketch, quizdata);
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



var convectionSketch = function(sketch) {
	sketch.setup = function() {
		sketch.createCanvas(sketch.displayWidth-10,sketch.displayHeight-10);
		sketch.smooth();

		sketch.sunShining = false;
		sketch.posx = 0;
		sketch.posy = 60;
		if (sketch.displayWidth <= 300)
			sketch.width = sketch.displayWidth-10;
		else sketch.width = 300;
		sketch.height = sketch.displayHeight-110;
		sketch.points = [];
		sketch.curCirc = [];

		var dist = 25;
		for (var i = 0; i < sketch.height/dist-1; i++){
			for (var j = 0; j < sketch.width/dist-1; j++){
				sketch.points[11*i+j] = [];
				sketch.points[11*i+j][0] = sketch.posx + 25 + j*dist;
				sketch.points[11*i+j][1] = sketch.posy + 25 + i*dist;
			}
		}
		console.log("w: " + sketch.displayWidth +", h: "+ sketch.displayHeight);
	}

	sketch.draw = function() {
		//The sun
		sketch.fill(255, 255, 0);
		sketch.stroke(255);
		sketch.ellipse(sketch.posx + sketch.width/2,-100,sketch.width,sketch.width);
		//der Kasten
		sketch.fill(255);
		sketch.stroke(0);
		sketch.rect(sketch.posx,sketch.posy,sketch.width,sketch.height);

		sketch.drawPoints();
		sketch.evaluate();
		if (sketch.sunShining)
			sketch.heating();
		else sketch.shakePoints(1);
	}

	sketch.drawPoints = function(){
		sketch.fill(0);
		sketch.stroke(0);
		for (var i = 0; i < sketch.points.length; i++){
			sketch.ellipse(sketch.points[i][0],sketch.points[i][1],5,5);
		}
	}

	sketch.shakePoints = function(action){
		for (var i = 0; i< sketch.points.length; i++){
			sketch.points[i][0] = sketch.points[i][0] + sketch.random(-action,action);
			//Horizontal Border
			if (sketch.points[i][0] < sketch.posx + 5)
				sketch.points[i][0] = sketch.posx + 5;
			else if(sketch.points[i][0] > sketch.posx+sketch.width-5)
				sketch.points[i][0] = sketch.posx+sketch.width-5;

			sketch.points[i][1] = sketch.points[i][1] + sketch.random(-action,action);
			//Vertical Border
			if (sketch.points[i][1] < sketch.posy + 5)
				sketch.points[i][1] = sketch.posy + 5;
			else if(sketch.points[i][1] > sketch.posy+sketch.height-5)
				sketch.points[i][1] = sketch.posy+sketch.height-5;
		}
	}
	sketch.heating = function(){
		//let the Sun shining
		sketch.stroke(255, 255, 0, 64);
		sketch.strokeWeight(5);
		sketch.line (sketch.posx + sketch.width*4/16,-100,sketch.posx, sketch.posy+sketch.height);
		sketch.line (sketch.posx + sketch.width*5/16,-100,sketch.posx+sketch.width*1/8, sketch.posy+sketch.height);
		sketch.line (sketch.posx + sketch.width*6/16,-100,sketch.posx+sketch.width*1/4, sketch.posy+sketch.height);
		sketch.line (sketch.posx + sketch.width*7/16,-100,sketch.posx+sketch.width*3/8, sketch.posy+sketch.height);
		sketch.line (sketch.posx + sketch.width*8/16,-100,sketch.posx+sketch.width/2, sketch.posy+sketch.height);
		sketch.line (sketch.posx + sketch.width*9/16,-100,sketch.posx+sketch.width*5/8, sketch.posy+sketch.height);
		sketch.line (sketch.posx + sketch.width*10/16,-100,sketch.posx+sketch.width*3/4, sketch.posy+sketch.height);
		sketch.line (sketch.posx + sketch.width*11/16,-100,sketch.posx+sketch.width*7/8, sketch.posy+sketch.height);
		sketch.line (sketch.posx + sketch.width*12/16,-100,sketch.posx+sketch.width, sketch.posy+sketch.height);
		sketch.stroke(255,0,0);
		sketch.strokeWeight(5);
		sketch.line(sketch.posx,sketch.posy+sketch.height,sketch.posx+sketch.width,sketch.posy+sketch.height);

		//shake and rising
		for (var i = 0; i< sketch.points.length; i++){
			var action = (sketch.points[i][1]-sketch.posy)/sketch.height*3+0.5;

			//The x-Value
			sketch.points[i][0] = sketch.points[i][0] + sketch.random(-action,action);
			if (sketch.points[i][0] < sketch.posx + 5)
				sketch.points[i][0] = sketch.posx + 5;
			else if(sketch.points[i][0] > sketch.posx+sketch.width-5)
				sketch.points[i][0] = sketch.posx+sketch.width-5;

			//The y-Value
			var o = sketch.checkRiseOrientation(sketch.points[i][1]);
			if (o == -1)
				sketch.points[i][1] = sketch.points[i][1] + sketch.random(-action,action*1.3);
			else if (o == 0)
				sketch.points[i][1] = sketch.points[i][1] + sketch.random(-action,action);
			else if (o == +1)
				sketch.points[i][1] = sketch.points[i][1] + sketch.random(-action*1.3,action);
			if (sketch.points[i][1] < sketch.posy + 5)
				sketch.points[i][1] = sketch.posy + 5;
			else if(sketch.points[i][1] > sketch.posy+sketch.height-5)
				sketch.points[i][1] = sketch.posy+sketch.height-5;
		}
	}
	//prueft wohin die Punkte wandern sollen
	sketch.checkRiseOrientation = function(h){
		if (sketch.posy < h && h < sketch.posy+sketch.height*1/6 && sketch.curCirc[0] > 70 && sketch.curCirc[1] < 55)
			return -1;
		if (sketch.posy+sketch.height*1/6 < h && h < sketch.posy+sketch.height*2/6 && sketch.curCirc[1] > 57)
			if (sketch.curCirc[2] < 47)
				return -1;
			else return 1;
		if (sketch.posy+sketch.height*2/6 < h && h < sketch.posy+sketch.height*3/6 && sketch.curCirc[2] > 47)
			if (sketch.curCirc[3] < 37)
				return -1;
			else return 1;
		if (sketch.posy+sketch.height*3/6 < h && h < sketch.posy+sketch.height*4/6 && sketch.curCirc[3] > 37)
			if (sketch.curCirc[4] < 27)
				return -1;
			else return 1;
		if (sketch.posy+sketch.height*4/6 < h && h < sketch.posy+sketch.height*5/6 && sketch.curCirc[4] > 27)
			if (sketch.curCirc[5] < 17)
				return -1;
			else return 1;
		if (sketch.posy+sketch.height*5/6 < h && h < sketch.posy+sketch.height && sketch.curCirc[5] > 17)
			return 1;
		return 0;
	}

	//zaehlt die Punkte pro 1/6 um zu verschieben
	sketch.evaluate = function(){
		for (var i = 0; i < 6; i++)
			sketch.curCirc[i]=0;
		for (var i = 0 ; i < sketch.points.length; i++){
			var h = sketch.points[i][1];
			if (h < sketch.posy+sketch.height*1/6)
				sketch.curCirc[0]++;
			else if (h<sketch.posy+sketch.height*2/6)
				sketch.curCirc[1]++;
			else if (h<sketch.posy+sketch.height*3/6)
				sketch.curCirc[2]++;
			else if(h<sketch.posy+sketch.height*4/6)
				sketch.curCirc[3]++;
			else if (h<sketch.posy+sketch.height*5/6)
				sketch.curCirc[4]++;
			else sketch.curCirc[5]++;
		}
		//if (frameCount%50==0)
		//    for (var i = 0; i<sketch.curCirc.length; i++)
		//        console.log(i+": " + sketch.curCirc[i]);
	}
	sketch.mousePressed = function(){
		var d = sketch.dist(sketch.mouseX, sketch.mouseY, sketch.posx + sketch.width/2, -100 );
		if (d < sketch.width){
			if (sketch.sunShining)
				sketch.setup();
			else sketch.sunShining = true;
		}

	}
}
