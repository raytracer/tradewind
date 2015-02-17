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

		//For 2D
		sketch.speed = 1;
		sketch.midd = 150;
		sketch.diameter = 100;
		sketch.lines2D = [];
		sketch.path = [];
		sketch.path[0] = [];
		sketch.path[0][0] = sketch.midd;
		sketch.path[0][1] = sketch.midd;
		for (var i = 0; i<8; i++){
			var val = sketch.rotateAtAngle(sketch.midd,sketch.midd,sketch.midd,sketch.midd+100,i * sketch.PI/4);
			sketch.lines2D[i]=[];
			sketch.lines2D[i][0]=val[0];
			sketch.lines2D[i][1]=val[1];
		} 
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
		sketch.stroke(255,0,0);
		for (var i = 0; i < sketch.lines2D.length; i++){
			sketch.line(sketch.midd,sketch.midd,sketch.lines2D[i][0],sketch.lines2D[i][1]);
			sketch.stroke(0);
			//compute the next Strokes
			var val = sketch.rotateAtAngle(sketch.midd,sketch.midd,sketch.lines2D[i][0],sketch.lines2D[i][1],sketch.radians(45.0));
			sketch.println(val[0]);
			sketch.lines2D[i][0] = val[0];
			sketch.lines2D[i][1] = val[1];
		}
	}

	sketch.draw3D = function(){

	}

	sketch.rotateAtAngle = function(midX, midY, pX, pY, angle){
		var d = sketch.sqrt(sketch.pow(midX-pX,2)+sketch.pow(midY-pY,2));
		var phi = sketch.acos(sketch.abs(pX-midX)/d);
		var result = [];
		result[0] = midX+sketch.cos(angle+phi)*d;
		result[1] = midY+sketch.sin(angle+phi)*d;
		return result;
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
