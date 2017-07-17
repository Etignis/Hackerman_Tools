class canvasConsole {
	constructor(parentEl, oParams){
		if(parentEl == undefined) {
			parentEl = "body";
		}
		this.sId = "canvasConsole";
		var nWidth = window.innerWidth
			|| document.documentElement.clientWidth
			|| document.body.clientWidth;
		var nHeight = window.innerHeight
			|| document.documentElement.clientHeight
			|| document.body.clientHeight;
			
		var oConsole = "<canvas id='" + this.sId + "' width='" + nWidth + "' height='" + nHeight + "'></canvas><input type='text' class='consoleInput'>";
		if(!($(parentEl + " #" + this.sId).length >0)) {
			$(parentEl).append(oConsole);
			//$(parentEl + " #" + this.sId).hide();
		}
		this.oTimer;
		this.c = document.getElementById(this.sId);
		this.ctx = this.c.getContext("2d");
		this.sText = "Some text. ";
		if(oParams && oParams.aSource) {
			this.sText = this._prepareSrc(oParams.aSource[this._randd(0, oParams.aSource.length-1)]);
		}
		this.fontSize = 16;
		this.fontRatio = 0.6;
		this.lineHeight = ~~(this.fontSize * 1.2);
		this.ctx.font = this.fontSize + "px monospace";
		
		this.ctx.fillStyle = "#00FF00";
		//this.ctx.fillRect(0,0,150,75);
		this.nMaxStrings = 10;
		this._calculateConsoleParameters();
	}
	_randd(min, max) {
		return Math.floor(Math.random() * (max - min )) + min;
	}
	
	_calculateConsoleParameters() {
		this.nColumns = ~~(this.c.width/(this.fontSize * this.fontRatio)); //number of columns 
		this.nStrings = ~~(this.c.height/this.lineHeight); //number of columns 
		this.oSymbol = {
			x: 0,
			y: 1
		};
	}

	_prepareSrc(sSrc){
		return sSrc.replace(/<br>/ig, "\n");
	}
	
	_printSymbol(sSrc, sNumber) {	
		var sSimbol = sSrc[sNumber];
	
		var nX = this.oSymbol.x * (this.fontSize * this.fontRatio);
		var nY = this.oSymbol.y * (this.lineHeight);

		this.oSymbol.x++;
		if(sSimbol == "\n"){
			this.oSymbol.x = 0;
			this.oSymbol.y++;
		}
		if(this.oSymbol.x > this.nColumns) {
			this.oSymbol.x = 0;
			this.oSymbol.y++;
		}
		if(this.oSymbol.y > this.nStrings)
			this.oSymbol.y = 1;
		
		this.ctx.fillText(sSimbol, nX, nY);
	}
	type() {
		do{	
			if(this.nSimbolNumber == undefined) 
				this.nSimbolNumber = 0;
				this._printSymbol(this.sText, this.nSimbolNumber);
			
			this.nSimbolNumber++;
			
			if(this.nSimbolNumber >= this.sText.length)
				this.nSimbolNumber = 0;
		} while (this.sText[this.nSimbolNumber] == " ")
	}
	//drawing the characters	
	draw() {
		//Black BG for the canvas
		//translucent BG to show trail
		this.ctx.fillStyle = "rgba(0, 0, 0, " + this._randd(1, 8)*0.01 + ")";
		this.ctx.fillRect(0, 0, this.c.width, this.c.height);
		
		this.ctx.fillStyle = "#0F0"; //green text
		this.ctx.font = this.font_size + "px arial";
		//looping over drops
		for(var i = 0; i < this.drops.length; i++) {
			//a random chinese character to print
			var rand = this._randd(0, this.simbols.length-1);
			var text = this.simbols[rand];
			//x = i*font_size, y = value of drops[i]*font_size
			var x = i*this.font_size,
				y = this.drops[i]*this.font_size;
			if(this.fShow || 1)
				this.ctx.fillText(text, x, y);
			
			//sending the drop back to the top randomly after it has crossed the screen
			//adding a randomness to the reset to make the drops scattered on the Y axis
			if(this.fShow && (this.drops[i]*this.font_size > this.c.height && Math.random() > 0.975))
				this.drops[i] = 0;
			
			//incrementing Y coordinate
			this.drops[i]++;
		}
	}
	
	show() {	
		var that = this; 	
		this.c = document.getElementById(this.sId);
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

		this.font_size = this._randd(10, 16);//10;
		var columns = this.c.width/this.font_size; //number of columns for the rain
		//an array of drops - one per column
		this.drops = [];
		//x below is the x coordinate
		//1 = y co-ordinate of the drop(same for every drop initially)
		for(var x = 0; x < columns; x++)
			this.drops[x] = 1; 	
		
		$("body #" + this.sId).show();
		this.oTimer = setInterval(that.draw.bind(that), this._randd(35, 55));
	}
	hide() {
		var that = this;
		this.fShow = false;
		setTimeout(
			function() {
				clearInterval(that.oTimer);
				$("body #" + this.sId).fadeOut();
			},
			2500
		)		
	}
}