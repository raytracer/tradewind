var sunSketch = function(sketch) {
	var slider;
	
	sketch.setup = function() {
		sketch.w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
		sketch.h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
		sketch.createCanvas(sketch.w/2.0, sketch.h);
		sketch.earthsize = Math.min(sketch.w/2,sketch.h)*0.7;
		slider = sketch.createSlider(0,364,0);
		slider.position(20,20);
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
		
	}
	
	sketch.sun = function(){
	
		sketch.stroke(0);
		sketch.fill(255,255,0);
		sketch.ellipse(sketch.w/4,sketch.h/2,sketch.earthsize*0.1,sketch.earthsize*0.1);
		
		
	
	
	}
	
}
