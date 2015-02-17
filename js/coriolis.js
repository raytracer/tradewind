var coriolisSketch = function(sketch) {
	sketch.setup = function() {
	//	var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
	//	var h = Math.max(doucment.documentElement.clientHeight, window.innerHeight || 0);
		sketch.createCanvas(300, 500);
		sketch.smooth();
	//	sketch.frameRate(1);
		
		//The Button for switch 2D/3D
		sketch.buttonX = 10;
		sketch.buttonY = 10;
		sketch.buttonH = 20;
		sketch.buttonW = 90;
		sketch.dimension = false;

		//Slider for speed
		sketch.speedSlider = sketch.createSlider(0, 50, 5);
		sketch.speedSlider.size(150,10);
		sketch.speedSlider.position(130,sketch.buttonY+sketch.buttonH+17);
		sketch.pause = false;
		
		//For 2D
		sketch.middX = 150;
		sketch.middY = 200;
		sketch.diameter = 125;
		sketch.rotate = 1.25;
		sketch.setup2D();
	}

	sketch.draw = function(){
		if (sketch.speedSlider.value() == 0){
			sketch.frameRate(1);
			sketch.pause = true;
		}else{
			sketch.frameRate(sketch.speedSlider.value());
			sketch.pause = false;
		}
		sketch.background(255);
		sketch.stroke(0);
		sketch.fill(255);
		sketch.text("Geschwindigkeit:",sketch.buttonX, sketch.buttonY+sketch.buttonH+25);
		sketch.rect(sketch.buttonX, sketch.buttonY, sketch.buttonW, sketch.buttonH);
		if (sketch.dimension){
			sketch.text("wechsel zu 2D",sketch.buttonX,sketch.buttonY+sketch.buttonH*2/3);
			sketch.draw3D();
		}else{
			sketch.text("wechsel zu 3D",sketch.buttonX,sketch.buttonY+sketch.buttonH*2/3);
			sketch.draw2D();
		}
	}

	sketch.setup2D = function(){
		sketch.lines2D = [];
		sketch.path = [];
		sketch.path[0] = [];
		sketch.path[0][0] = sketch.middX;
		sketch.path[0][1] = sketch.middY;
		for (var i = 0; i<8; i++){
			var val = sketch.rotateAtAngle(sketch.middX, sketch.middY, sketch.middX, sketch.middY-sketch.diameter, i*sketch.PI/4);
			sketch.lines2D[i]=[];
			sketch.lines2D[i][0]=val[0];
			sketch.lines2D[i][1]=val[1];
		} 
	}
	
	sketch.draw2D = function(){
		sketch.stroke(0);
		sketch.fill(255);
//		for (var i = sketch.diameter*2; i> 0 ; i-=25){
//			sketch.ellipse(sketch.middX,sketch.middY,i,i);
//		}
		sketch.ellipse(sketch.middX,sketch.middY,sketch.diameter*2,sketch.diameter*2);
		sketch.stroke(255,0,0);
		for (var i = 0; i < sketch.lines2D.length; i++){
			sketch.line(sketch.middX,sketch.middY,sketch.lines2D[i][0],sketch.lines2D[i][1]);
			sketch.stroke(0);
			
			//compute the next Strokes
			if(!sketch.pause){
				var val = sketch.rotateAtAngle(sketch.middX,sketch.middY,sketch.lines2D[i][0],sketch.lines2D[i][1],sketch.radians(sketch.rotate));
				sketch.lines2D[i][0] = val[0];
				sketch.lines2D[i][1] = val[1];
			}
		}
		if(!sketch.pause){
			sketch.path[sketch.path.length]=[];
			sketch.path[sketch.path.length-1][0]=sketch.path[sketch.path.length-2][0];
			sketch.path[sketch.path.length-1][1]=sketch.path[sketch.path.length-2][1]+5;
		}
		sketch.fill(0,0,255);
		sketch.stroke(0,0,255);
		for (var i=0; i < sketch.path.length;i++){
			sketch.ellipse(sketch.path[i][0], sketch.path[i][1], 5, 5);
			if(!sketch.pause){
				var val = sketch.rotateAtAngle(sketch.middX, sketch.middY, sketch.path[i][0], sketch.path[i][1], sketch.radians(sketch.rotate));
				sketch.path[i][0] = val[0];
				sketch.path[i][1] = val[1];

				if (val[1]>sketch.middY+sketch.diameter){
					sketch.setup2D();
				}
			}
		}
	}

	sketch.draw3D = function(){

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
			if (sketch.dimension)
				sketch.setup();
			else sketch.dimension = true;
		}
	}
}
