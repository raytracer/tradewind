var coriolisSketch = function(sketch) {
	sketch.setup = function() {
		sketch.w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
		sketch.h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
		sketch.createCanvas(sketch.w/2.0, sketch.h);
	//	var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
	//	var h = Math.max(doucment.documentElement.clientHeight, window.innerHeight || 0);
	//	sketch.createCanvas(300, 375);
		sketch.smooth();
	//	sketch.frameRate(1);
		
		//The Button for switch Earth/Abstract
		sketch.buttonX = 10;
		sketch.buttonY = 350;
		sketch.buttonH = 18;
		sketch.buttonW = 90;
		sketch.switch = false;
		
		//Slider for speed
		sketch.speedSlider = sketch.createSlider(0, 50, 5);
		sketch.speedSlider.size(150,10);
		sketch.speedSlider.position(150,10);
		sketch.pause = false;
		
		//For 2D
		sketch.middX = 150;
		sketch.middY = 200;
		sketch.diameter = 150;
		sketch.currentRotation = 0;
		sketch.rotAngle = 1.25;
		sketch.earth = sketch.loadImage("images/satelitenbild-nordhalbkugel.png");
		sketch.setup2D();
	}

	sketch.draw = function(){
		if (sketch.speedSlider.value() == 0){
			sketch.pause = true;
		}else{
			sketch.frameRate(sketch.speedSlider.value());
			sketch.pause = false;
			sketch.currentRotation += sketch.rotAngle;
		}
		sketch.background(255);
		sketch.stroke(0);
		sketch.fill(255);
		var textSize = 15;
		sketch.textFont('Helvetica');
		sketch.textSize(textSize);
		sketch.text("Geschwindigkeit:",15, 15);
		sketch.rect(sketch.buttonX, sketch.buttonY, sketch.buttonW, sketch.buttonH);
		if (sketch.switch){
			sketch.text("Kartenansicht",sketch.buttonX,sketch.buttonY+sketch.buttonH*3/4);
			sketch.imageMode(sketch.CENTER);
			sketch.rotate(sketch.radians(-sketch.currentRotation));
			//sketch.image(sketch.earth,sketch.middX,sketch.middY,sketch.diameter*2,sketch.diameter*2);
			var val = sketch.rotateAtAngle(0, 0, sketch.middX, sketch.middY,sketch.radians(-sketch.currentRotation));
			sketch.image(sketch.earth,val[0],val[1],sketch.diameter*2,sketch.diameter*2);
			sketch.rotate(sketch.radians(sketch.currentRotation));
		}else{
			sketch.text("Satelitenbild",sketch.buttonX,sketch.buttonY+sketch.buttonH*3/4);
			sketch.ellipse(sketch.middX,sketch.middY,sketch.diameter*2,sketch.diameter*2);
		}
		sketch.draw2D();
	}

	sketch.setup2D = function(){
		sketch.path = [];
		sketch.path[0] = [];
		sketch.path[0][0] = sketch.middX;
		sketch.path[0][1] = sketch.middY;
		if (!sketch.switch){
			sketch.lines2D = [];
			for (var i = 0; i<8; i++){
				var val = sketch.rotateAtAngle(sketch.middX, sketch.middY, sketch.middX, sketch.middY-sketch.diameter, i*sketch.PI/4);
				sketch.lines2D[i]=[];
				sketch.lines2D[i][0]=val[0];
				sketch.lines2D[i][1]=val[1];
			}
		}
	}
	
	sketch.draw2D = function(){
		sketch.stroke(0);
		sketch.fill(255);
		sketch.stroke(255,0,0);
		for (var i = 0; i < sketch.lines2D.length; i++){
			sketch.line(sketch.middX,sketch.middY,sketch.lines2D[i][0],sketch.lines2D[i][1]);
			sketch.stroke(0);
			
			//compute the next Strokes
			if(!sketch.pause){
				var val = sketch.rotateAtAngle(sketch.middX,sketch.middY,sketch.lines2D[i][0],sketch.lines2D[i][1],sketch.radians(sketch.rotAngle));
				sketch.lines2D[i][0] = val[0];
				sketch.lines2D[i][1] = val[1];
			}
		}
		
		//The Drops
		if(!sketch.pause){
			sketch.path[sketch.path.length]=[];
			sketch.path[sketch.path.length-1][0]=sketch.path[sketch.path.length-2][0];
			sketch.path[sketch.path.length-1][1]=sketch.path[sketch.path.length-2][1]+5;
		}
		if (sketch.switch){
			sketch.fill(255,160,0);
			sketch.stroke(255,160,0);
		}else{
			sketch.fill(0,0,255);
			sketch.fill(0,0,255);
		}
		for (var i=0; i < sketch.path.length;i++){
			sketch.ellipse(sketch.path[i][0], sketch.path[i][1], 5, 5);
			if(!sketch.pause){
				var val = sketch.rotateAtAngle(sketch.middX, sketch.middY, sketch.path[i][0], sketch.path[i][1], sketch.radians(sketch.rotAngle));
				sketch.path[i][0] = val[0];
				sketch.path[i][1] = val[1];

				if (val[1]>sketch.middY+sketch.diameter){
					sketch.setup2D();
				}
			}
		}
	}

	sketch.rotateAtAngle = function(midX, midY, pX, pY, angle){
		var d = sketch.sqrt(sketch.pow(midX-pX,2)+sketch.pow(midY-pY,2));
		var phi = sketch.atan2(pY-midY,pX-midX);
		
		var result = [];
		result[0] = midX+sketch.cos(phi-angle)*d;
		result[1] = midY+sketch.sin(phi-angle)*d;
		return result;
	}

	sketch.mousePressed = function(){
		if ( sketch.buttonX <= sketch.mouseX && sketch.mouseX <= sketch.buttonX+sketch.buttonW && 
		     sketch.buttonY <= sketch.mouseY && sketch.mouseY <= sketch.buttonY+sketch.buttonH ){
			if (sketch.switch)
				sketch.switch = false
			else sketch.switch = true;
		}
	}
	
}
