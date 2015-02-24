var sunSketch = function(sketch) {
	var slider;
	
	sketch.setup = function() {
		sketch.w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
		sketch.h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
		sketch.createCanvas(sketch.w/2.0, sketch.h);
		
		sketch.earthsize = Math.min(sketch.w/2,sketch.h)*0.7;
		sketch.earthmiddle = sketch.earthsize/2;
		
		//Slider
		sketch.slider = sketch.createSlider(0,364,0);
		sketch.slider.position(sketch.w/4-sketch.earthsize/2, sketch.earthsize+10);
		sketch.slider.size(sketch.earthsize, 10);
		
		
		sketch.earth = sketch.loadImage("images/globe.png");
				
		sketch.smooth();
	
		
	}

	sketch.draw = function(){
		sketch.background(255);
		sketch.stroke(0);
		sketch.fill(255);
		
		//Erdkugel
		sketch.imageMode(sketch.CENTER);
		sketch.image(sketch.earth,sketch.w/4,sketch.earthmiddle,sketch.earthsize,sketch.earthsize);
		
		//Aequator
		sketch.line(sketch.w/4-sketch.earthsize/2,sketch.earthmiddle,sketch.w/4+sketch.earthsize/2,sketch.earthmiddle)
		
		sketch.sun();
		
		sketch.drawDate();
	}
	
	sketch.sun = function(){
	
		var day = sketch.slider.value();

		var pos=0;
		if(day<171){
			pos=171-day}
		else if(day>354){
			pos=182-(day-354)}
		else{pos=day-171
		day}			
	
		var scale = 0.2;
		var height = sketch.earthmiddle+(pos-91)/182*sketch.earthsize*scale;
		
		//Wendekreise
		sketch.stroke(255);
		sketch.strokeWeight(0.5);
		sketch.line(sketch.w/4-sketch.earthsize/2,sketch.earthmiddle+sketch.earthsize*scale/2,sketch.w/4+sketch.earthsize/2,sketch.earthmiddle+sketch.earthsize*scale/2);
		sketch.line(sketch.w/4-sketch.earthsize/2,sketch.earthmiddle-sketch.earthsize*scale/2,sketch.w/4+sketch.earthsize/2,sketch.earthmiddle-sketch.earthsize*scale/2);
		
		//Sonne
		sketch.strokeWeight(1);
		sketch.stroke(0);
		sketch.fill(255,255,0);
		sketch.ellipse(sketch.w/4,height,sketch.earthsize*0.1,sketch.earthsize*0.1);
			
	
	}
	
	sketch.drawDate = function() {
		var day = sketch.slider.value()+1;
		var month = 0;
		var months = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
		var days = [31,59,90,120,151,181,212,243,273,304,334,365];
	
			for (i = 11; i >= 0; i--) {
				if(day > days[i]){
					day = day-days[i];
					month = i+1;
				} 			
			}		
		
		var date = day+'. '+months[month];
		sketch.stroke(0);
		sketch.fill(0);
		var textSize = 15;
		sketch.textFont('Helvetica');
		sketch.textSize(textSize);
		sketch.text(date, sketch.w/4 - textSize * 3, sketch.earthsize+40);
	}
}
