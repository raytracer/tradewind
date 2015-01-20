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
