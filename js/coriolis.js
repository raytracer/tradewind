var coriolisSketch = function(sketch) {
	sketch.setup = function() {
	//	var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
	//	var h = Math.max(doucment.documentElement.clientHeight, window.innerHeight || 0);
		sketch.createCanvas(300, 500);
		sketch.smooth();

		//The Button for switch 2D/3D
		sketch.buttonX = 10;
		sketch.buttonY = 10;
		sketch.buttonH = 20;
		sketch.buttonW = 90;
		sketch.dimension = false;

		sketch.speed = 1;
	}

	sketch.draw = function(){
		sketch.background(255);
		sketch.stroke(0);
		sketch.fill(255);
		sketch.rect(sketch.buttonX,sketch.buttonY,sketch.buttonW,sketch.buttonH);
		if (sketch.dimension){
			sketch.text("wechsel zu 2D",sketch.buttonX,sketch.buttonY+sketch.buttonH*2/3);
			sketch.draw3D();
		}else{
			sketch.text("wechsel zu 3D",sketch.buttonX,sketch.buttonY+sketch.buttonH*2/3);
			sketch.draw2D();
		}
	}

	sketch.draw2D = function(){
		sketch.stroke(0);
		sketch.fill(255);
		for (var i = 200; i> 0 ; i-=25){
			sketch.ellipse(150,150,i,i);
		}
		sketch.line(150,150,50,150);
		sketch.line(150,150,250,150);
		sketch.line(150,150,150,250);
		sketch.line(150,150,79,79);
		sketch.line(150,150,79,221);
		sketch.line(150,150,221,79);
		sketch.line(150,150,221,221);
		sketch.stroke(255,0,0);
		sketch.line(150,150,150,50);
	}

	sketch.draw3D = function(){

	}

	sketch.mousePressed = function(){
		if ( sketch.buttonX <= sketch.mouseX && sketch.mouseX <= sketch.buttonX+sketch.buttonW && 
		     sketch.buttonY <= sketch.mouseY && sketch.mouseY <= sketch.buttonY+sketch.buttonH ){
			if (sketch.dimension)
				sketch.setup();
			else sketch.dimension = true;
		}
	}
}
