var convectionSketch = function(sketch) {
	sketch.setup = function() {
		sketch.createCanvas(sketch.displayWidth-10,sketch.displayHeight-50);
		sketch.smooth();

		sketch.wind = false;
		sketch.sunShining = false;
		sketch.posx = 100;
		sketch.posy = 60;
		if (sketch.displayWidth <= 510)
			sketch.rectWidth = sketch.displayWidth-210;
		else sketch.rectWidth = 300;
		if (sketch.displayHeight < 715)
			sketch.rectHeight = sketch.displayHeight-115;
		else sketch.rectHeight = 600;
		sketch.points = [];
		sketch.curCirc = [];
		sketch.targetCirc = [];

		//initialise Points
		var dist = 25;
		for (var i = 0; i < sketch.rectHeight/dist-1; i++){
			for (var j = 0; j < sketch.rectWidth/dist-1; j++){
				sketch.points[11*i+j] = [];
				sketch.points[11*i+j][0] = sketch.posx + dist + j*dist;
				sketch.points[11*i+j][1] = sketch.posy + dist + i*dist;
			}
		}
		
		//Target Diservification at Heating
		sketch.targetCirc[0] = sketch.points.length/6 + sketch.points.length/dist/2*5;
		sketch.targetCirc[1] = sketch.points.length/6 + sketch.points.length/dist/2*3;
		sketch.targetCirc[2] = sketch.points.length/6 + sketch.points.length/dist/2*1;
		sketch.targetCirc[3] = sketch.points.length/6 - sketch.points.length/dist/2*1;
		sketch.targetCirc[4] = sketch.points.length/6 - sketch.points.length/dist/2*3;
		sketch.targetCirc[5] = sketch.points.length/6 - sketch.points.length/dist/2*5;
		
		console.log("w: " + sketch.displayWidth +", h: "+ sketch.displayHeight);
	}

	sketch.draw = function() {
		sketch.background(255);
		//The sun
		sketch.fill(255, 255, 0);
		sketch.stroke(255);
		sketch.ellipse(sketch.posx + sketch.rectWidth/2,-100,sketch.rectWidth,sketch.rectWidth);
		//der Kasten
		sketch.fill(255);
		sketch.stroke(0);
		sketch.rect(sketch.posx,sketch.posy,sketch.rectWidth,sketch.rectHeight);

		sketch.drawPoints();
		sketch.evaluate();
		if (sketch.sunShining)
			sketch.heating();
		else sketch.shakePoints(2);
		if (sketch.wind)
			sketch.drawWind();
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
			else if(sketch.points[i][0] > sketch.posx+sketch.rectWidth-5)
				sketch.points[i][0] = sketch.posx+sketch.rectWidth-5;

			sketch.points[i][1] = sketch.points[i][1] + sketch.random(-action,action);
			//Vertical Border
			if (sketch.points[i][1] < sketch.posy + 5)
				sketch.points[i][1] = sketch.posy + 5;
			else if(sketch.points[i][1] > sketch.posy+sketch.rectHeight-5)
				sketch.points[i][1] = sketch.posy+sketch.rectHeight-5;
		}
	}
	sketch.heating = function(){
		//let the Sun shining
		sketch.stroke(255, 255, 0, 64);
		sketch.strokeWeight(5);
		sketch.line (sketch.posx + sketch.rectWidth*4/16,-100,sketch.posx, sketch.posy+sketch.rectHeight);
		sketch.line (sketch.posx + sketch.rectWidth*5/16,-100,sketch.posx+sketch.rectWidth*1/8, sketch.posy+sketch.rectHeight);
		sketch.line (sketch.posx + sketch.rectWidth*6/16,-100,sketch.posx+sketch.rectWidth*1/4, sketch.posy+sketch.rectHeight);
		sketch.line (sketch.posx + sketch.rectWidth*7/16,-100,sketch.posx+sketch.rectWidth*3/8, sketch.posy+sketch.rectHeight);
		sketch.line (sketch.posx + sketch.rectWidth*8/16,-100,sketch.posx+sketch.rectWidth/2, sketch.posy+sketch.rectHeight);
		sketch.line (sketch.posx + sketch.rectWidth*9/16,-100,sketch.posx+sketch.rectWidth*5/8, sketch.posy+sketch.rectHeight);
		sketch.line (sketch.posx + sketch.rectWidth*10/16,-100,sketch.posx+sketch.rectWidth*3/4, sketch.posy+sketch.rectHeight);
		sketch.line (sketch.posx + sketch.rectWidth*11/16,-100,sketch.posx+sketch.rectWidth*7/8, sketch.posy+sketch.rectHeight);
		sketch.line (sketch.posx + sketch.rectWidth*12/16,-100,sketch.posx+sketch.rectWidth, sketch.posy+sketch.rectHeight);
		sketch.stroke(255,0,0);
		sketch.strokeWeight(5);
		sketch.line(sketch.posx,sketch.posy+sketch.rectHeight,sketch.posx+sketch.rectWidth,sketch.posy+sketch.rectHeight);

		//shake and rising
		for (var i = 0; i< sketch.points.length; i++){
			var action = (sketch.points[i][1]-sketch.posy)/sketch.rectHeight*4+1.5;

			//The x-Value
			sketch.points[i][0] = sketch.points[i][0] + sketch.random(-action,action);
			if (sketch.points[i][0] < sketch.posx + 5)
				sketch.points[i][0] = sketch.posx + 5;
			else if(sketch.points[i][0] > sketch.posx+sketch.rectWidth-5)
				sketch.points[i][0] = sketch.posx+sketch.rectWidth-5;

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
			else if(sketch.points[i][1] > sketch.posy+sketch.rectHeight-5)
				sketch.points[i][1] = sketch.posy+sketch.rectHeight-5;
		}
	}
	//prueft wohin die Punkte wandern sollen
	sketch.checkRiseOrientation = function(h){
		if (sketch.posy < h && h < sketch.posy+sketch.rectHeight*1/6 && sketch.curCirc[0] > sketch.targetCirc[0]+2 && sketch.curCirc[1] < sketch.targetCirc[1]-2)
			return -1;
		if (sketch.posy+sketch.rectHeight*1/6 < h && h < sketch.posy+sketch.rectHeight*2/6 && sketch.curCirc[1] > sketch.targetCirc[1])
			if (sketch.curCirc[2] < sketch.targetCirc[2])
				return -1;
			else return 1;
		if (sketch.posy+sketch.rectHeight*2/6 < h && h < sketch.posy+sketch.rectHeight*3/6 && sketch.curCirc[2] > sketch.targetCirc[2])
			if (sketch.curCirc[3] < sketch.targetCirc[3])
				return -1;
			else return 1;
		if (sketch.posy+sketch.rectHeight*3/6 < h && h < sketch.posy+sketch.rectHeight*4/6 && sketch.curCirc[3] > sketch.targetCirc[3])
			if (sketch.curCirc[4] < sketch.targetCirc[4])
				return -1;
			else return 1;
		if (sketch.posy+sketch.rectHeight*4/6 < h && h < sketch.posy+sketch.rectHeight*5/6 && sketch.curCirc[4] > sketch.targetCirc[4])
			if (sketch.curCirc[5] < sketch.targetCirc[5])
				return -1;
			else return 1;
		if (sketch.posy+sketch.rectHeight*5/6 < h && h < sketch.posy+sketch.rectHeight && sketch.curCirc[5] > sketch.targetCirc[5])
			return 1;
		return 0;
	}

	//zaehlt die Punkte pro 1/6 um zu verschieben
	sketch.evaluate = function(){
		for (var i = 0; i < 6; i++)
			sketch.curCirc[i]=0;
		for (var i = 0 ; i < sketch.points.length; i++){
			var h = sketch.points[i][1];
			if (h < sketch.posy+sketch.rectHeight*1/6)
				sketch.curCirc[0]++;
			else if (h<sketch.posy+sketch.rectHeight*2/6)
				sketch.curCirc[1]++;
			else if (h<sketch.posy+sketch.rectHeight*3/6)
				sketch.curCirc[2]++;
			else if(h<sketch.posy+sketch.rectHeight*4/6)
				sketch.curCirc[3]++;
			else if (h<sketch.posy+sketch.rectHeight*5/6)
				sketch.curCirc[4]++;
			else sketch.curCirc[5]++;
		}
		if (sketch.sunShining && !sketch.wind && sketch.curCirc[4]+sketch.curCirc[5] < sketch.points.length/4){
			sketch.wind = true;
		}
		//if (sketch.frameCount%50==0){
		//    for (var i = 0; i<sketch.curCirc.length; i++)
		//        console.log(i+": " + sketch.curCirc[i]);
	}

	sketch.drawWind = function(){
		console.log("startWind");
		drawCurve(sketch,sketch.posx+sketch.rectWidth+80,sketch.posx+sketch.rectWidth*5/8,sketch.posx+sketch.rectWidth/2+10,sketch.posx+sketch.rectWidth/2+10,sketch.posy+sketch.rectHeight-5,sketch.posy+sketch.rectHeight-5,sketch.posy+sketch.rectHeight*7/8,sketch.posy+sketch.rectHeight*3/4,3);
		drawCurve(sketch,sketch.posx-80,sketch.posx+sketch.rectWidth*3/8,sketch.posx+sketch.rectWidth/2-10,sketch.posx+sketch.rectWidth/2-10,sketch.posy+sketch.rectHeight-5,sketch.posy+sketch.rectHeight-5,sketch.posy+sketch.rectHeight*7/8,sketch.posy+sketch.rectHeight*3/4,3);
	}

	sketch.mousePressed = function(){
		var d = sketch.dist(sketch.mouseX, sketch.mouseY, sketch.posx + sketch.rectWidth/2, -100 );
		if (d < sketch.rectWidth){
			if (sketch.sunShining)
				sketch.setup();
			else sketch.sunShining = true;
		}
	}
}
