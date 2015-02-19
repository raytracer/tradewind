var sunSketch = function(sketch) {
	sketch.setup = function() {
		sketch.w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
		sketch.h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
		sketch.createCanvas(sketch.w/2.0, sketch.h);
		sketch.smooth();
	
		
	}

	sketch.draw = function(){
		sketch.background(255);
		sketch.stroke(0);
		sketch.fill(255);
		
		var earthsize = Math.min(sketch.w,sketch.h)*0.7;
		
		sketch.fill(0,255,0);
		sketch.ellipse(sketch.h/2,sketch.w/2,sketch.earthsize,sketch.earthsize);
		sketch.stroke(255);
		
	}

	
}
