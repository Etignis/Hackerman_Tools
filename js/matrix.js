class matrixRain {
	constructor(parentEl){
		if(parentEl == undefined) {
			parentEl = "body";
		}
		var oMatrix = "<canvas id='cMatrix'></canvas>"
		if(!($(parentEl + " #cMatrix").length >0)) {
			$(parentEl).append(oMatrix);
			$(parentEl + " #cMatrix").hide();
		}
		this.oTimer;
		this.ctx = null;
	}
	_randd(min, max) {
		return Math.floor(Math.random() * (max - min )) + min;
	}
	//drawing the characters	
	draw() {
		//Black BG for the canvas
		//translucent BG to show trail
		this.ctx.fillStyle = "rgba(0, 0, 0, " + this._randd(1, 8)*0.01 + ")";
		this.ctx.fillRect(0, 0, this.c.width, this.c.height);
		
		this.ctx.fillStyle = "#0F0"; //green text
		//looping over drops
		for(var i = 0; i < this.drops.length; i++) {
			//a random chinese character to print
			var rand = this._randd(0, this.simbols.length-1);
			var text = this.simbols[rand];
			this.ctx.font = this.drops[i].font + "px arial";
			//x = i*font_size, y = value of drops[i]*font_size
			var x = i*this.drops[i].font,
				y = this.drops[i].val * this.drops[i].font/*.font_size*/;
			if(this.fShow || 1)
				this.ctx.fillText(text, x, y);
			
			//sending the drop back to the top randomly after it has crossed the screen
			//adding a randomness to the reset to make the drops scattered on the Y axis
			if(this.fShow && (this.drops[i].val*this.drops[i].font > this.c.height && Math.random() > 0.975))
				this.drops[i].val = 0;
			
			//incrementing Y coordinate
			this.drops[i].val++;
		}
	}
	
	show() {	
		var that = this; 	
		this.c = document.getElementById("cMatrix");
		this.ctx = this.c.getContext("2d");
		
		this.fShow = true;

		//making the canvas full screen
		this.c.height = window.innerHeight;
		this.c.width = window.innerWidth;

		//chinese characters - taken from the unicode charset
		var chinese = "田由甲申甴电甶男甸甹町画甼甽甾甿畀畁畂畃畄畅畆畇畈畉畊畋界畍畎畏畐畑";
		var sChars= [
			"田由甲申甴电甶男甸甹町画甼甽甾甿畀畁畂畃畄畅畆畇畈畉畊畋界畍畎畏畐畑",
			"ホンコンカオシュン/タカオシャンハイナンキンタイペイはたらもんめ",
			"010101",
			"ಳಱಭಭಫನಧಥಣಡಠಟಞಗಖಔၷ೯",
			"ऄअआइईउऊऋऌऍऎऑकखगघङचछजझटडदपफबलळऴश",
			"ԱԲԳԴԵԶԷԸԹԺԻԽԾԿՀՁՂՃՅՇՋՖ₪թ",
			"ᇅᇃᇉᇊᇋᇌᇍᇎᇏᇐᇕᇘᇤ",
			"▖▗▘▙▚▛▜▝▞▟■",
			"กขฃคฅฆงจฉชซฌญฎฏฐฑฒณดปฟร"
		];
		//converting the string into an array of single characters
		this.simbols = sChars[this._randd(0, sChars.length-1)].split(""); //sChars[sChars.length-1].split(""); //sChars[this._randd(0, sChars.length-1)].split("");

		/*/
		this.font_size = this._randd(10, 16);//10;
		var columns = this.c.width/this.font_size; //number of columns for the rain
		//an array of drops - one per column
		this.drops = [];
		//x below is the x coordinate
		//1 = y co-ordinate of the drop(same for every drop initially)
		for(var x = 0; x < columns; x++)
			this.drops[x] = 1; 	
		
		/**/
			this.drops = [];
		for(var x=0, wid=0; wid<this.c.width; x++) {
			let nFontSize = this._randd(10, 16);//10;
			wid+=nFontSize;
			this.drops[x] = {
				val: 1,
				font: nFontSize
			}; 	
		}
		
		$("body #cMatrix").show();
		this.oTimer = setInterval(that.draw.bind(that), this._randd(35, 55));
	}
	hide() {
		var that = this;
		this.fShow = false;
		setTimeout(
			function() {
				clearInterval(that.oTimer);
				$("body #cMatrix").fadeOut();
			},
			2500
		)		
	}
}