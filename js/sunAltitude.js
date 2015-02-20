var sunSketch = function(sketch) {
	var slider;
	
	sketch.setup = function() {
		sketch.w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
		sketch.h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
		sketch.createCanvas(sketch.w/2.0, sketch.h);
		sketch.earthsize = Math.min(sketch.w/2,sketch.h)*0.7;
		sketch.slider = sketch.createSlider(0,364,0);
		sketch.slider.position(sketch.w/4-sketch.earthsize/2, sketch.earthsize/2+sketch.h/2+10);
		sketch.slider.size(sketch.earthsize, 10);
		sketch.smooth();
	
		
	}

	sketch.draw = function(){
		sketch.background(255);
		sketch.stroke(0);
		sketch.fill(255);
		
		
		
		sketch.fill(0,255,0);
		sketch.ellipse(sketch.w/4,sketch.h/2,sketch.earthsize,sketch.earthsize);
		sketch.stroke(0);
		
		sketch.line(sketch.w/4-sketch.earthsize/2,sketch.h/2,sketch.w/4+sketch.earthsize/2,sketch.h/2)
		sketch.stroke(255);
		
		sketch.sun();
		
		sketch.drawDate();
	}
	
	sketch.sun = function(){
	
		var day = sketch.slider.value();
		//172. Tag: Sonne oben
		//day = (day+172)%364;
		var pos=0;
		if(day<171){
			pos=171-day}
		else if(day>354){
			pos=182-(day-354)}
		else{pos=day-171
		day}
		
		
	
		var scale=0.7;
		var height= sketch.h/2-sketch.earthsize/2+sketch.earthsize*(1-scale)/2+((day/365)*sketch.earthsize*scale)
		
		sketch.stroke(0);
		sketch.fill(255,255,0);
		sketch.ellipse(sketch.w/4,sketch.h/2-sketch.earthsize/2+sketch.earthsize*(1-scale)+((pos/365)*sketch.earthsize*scale),sketch.earthsize*0.1,sketch.earthsize*0.1);
		
		
	
	
	}
	
	sketch.drawDate = function() {
		var day = sketch.slider.value();
		var months = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];

		var month = months[Math.floor(day/365 * 12)];
		sketch.stroke(0);
		sketch.fill(0);
		var textSize = 15;
		sketch.textFont('Helvetica');
		sketch.textSize(textSize);
		sketch.text(month, sketch.w/4 - textSize * (month.length/4), sketch.h - textSize);
	}
}
