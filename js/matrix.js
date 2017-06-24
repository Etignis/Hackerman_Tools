class matrixRain {
	constructor(n){
		var oMatrix = "<canvas id='cMatrix'></canvas>"
		if(!($("body #cMatrix").length >0)) {
			$("body").append(oMatrix);
			$("body #cMatrix").hide();
		}
		this.oTimer;
		this.ctx = null;
	}
	
	//drawing the characters	
	draw() {
		//Black BG for the canvas
		//translucent BG to show trail
		this.ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
		this.ctx.fillRect(0, 0, this.c.width, this.c.height);
		
		this.ctx.fillStyle = "#0F0"; //green text
		this.ctx.font = this.font_size + "px arial";
		//looping over drops
		for(var i = 0; i < this.drops.length; i++)
		{
			//a random chinese character to print
			var text = this.chinese[Math.floor(Math.random()*this.chinese.length)];
			//x = i*font_size, y = value of drops[i]*font_size
			this.ctx.fillText(text, i*this.font_size, this.drops[i]*this.font_size);
			
			//sending the drop back to the top randomly after it has crossed the screen
			//adding a randomness to the reset to make the drops scattered on the Y axis
			if(this.drops[i]*this.font_size > this.c.height && Math.random() > 0.975)
				this.drops[i] = 0;
			
			//incrementing Y coordinate
			this.drops[i]++;
		}
	}
	
	show() {	
		var that = this; 	
		this.c = document.getElementById("cMatrix");
		this.ctx = this.c.getContext("2d");

		//making the canvas full screen
		this.c.height = window.innerHeight;
		this.c.width = window.innerWidth;

		//chinese characters - taken from the unicode charset
		this.chinese = "田由甲申甴电甶男甸甹町画甼甽甾甿畀畁畂畃畄畅畆畇畈畉畊畋界畍畎畏畐畑";
		//converting the string into an array of single characters
		this.chinese = this.chinese.split("");

		this.font_size = 10;
		var columns = this.c.width/this.font_size; //number of columns for the rain
		//an array of drops - one per column
		this.drops = [];
		//x below is the x coordinate
		//1 = y co-ordinate of the drop(same for every drop initially)
		for(var x = 0; x < columns; x++)
			this.drops[x] = 1; 	
		
		$("body #cMatrix").show();
		this.oTimer = setInterval(that.draw.bind(that), 33);
	}
	hide() {
		clearInterval(this.oTimer);
		$("body #cMatrix").hide();
	}
}