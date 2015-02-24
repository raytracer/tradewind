var northEastSketch = function(sketch) {
	sketch.setup = function() {
		sketch.w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
		sketch.h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
		sketch.createCanvas(sketch.w/2.0, sketch.h);
		sketch.pict = sketch.loadImage("images/nordostPassat.png");
	}
	sketch.draw = function(){
		sketch.image(sketch.pict,0,0);
	}
}