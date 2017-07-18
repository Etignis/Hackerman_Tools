class canvasConsole {
	constructor(parentEl, oParams){
		this.parentEl = (parentEl == undefined)? "body" : parentEl
		this.sId = "canvasConsole";
		var nWidth = window.innerWidth
			|| document.documentElement.clientWidth
			|| document.body.clientWidth;
		var nHeight = window.innerHeight
			|| document.documentElement.clientHeight
			|| document.body.clientHeight;

		var oConsole = "<canvas id='" + this.sId + "' width='" + nWidth + "' height='" + nHeight + "'></canvas><input type='text' class='consoleInput'>";
		if(!($(this.parentEl + " #" + this.sId).length >0)) {
			$(this.parentEl).append(oConsole);
			//$(parentEl + " #" + this.sId).hide();
		}
		this.nCanvasWidth = nWidth;
		this.nCanvasHeight = nHeight;
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

		this.mainColor = "#00FF00";
		this.ctx.fillStyle = "#00FF00";
		this.aCode = [""];
		this.nMaxStrings = 10;
		this._calculateConsoleParameters();
		this._lastAnimationFrameTime = 0;
		this._lastFpsUpdateTime = 0;
		this._last_time = 0;
		this._isOn = true;

		this.elapsed = 0;
		this.now =0;
		this.then = 0;
		this.fpsInterval = 0;
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

		var nX = ~~(this.oSymbol.x * (this.fontSize * this.fontRatio));
		var nY = ~~(this.oSymbol.y * (this.lineHeight));

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
	/**
	 * When key clicked
	 */
	type() {
		do {
			if(this.nSimbolNumber == undefined)
				this.nSimbolNumber = 0;

			// add to console text
			var sSimbol = this.sText[this.nSimbolNumber];
			if(sSimbol == "\n") {
				this.aCode.push([]);
				if (
						this.aCode.length >= this.nStrings ||
						this.aCode.length >= this.nMaxStrings
					) {
					this.aCode.shift();
				}
			} else {
				this.aCode[this.aCode.length - 1] += sSimbol;
			}

			this.nSimbolNumber++;

			if(this.nSimbolNumber >= this.sText.length)
				this.nSimbolNumber = 0;
		} while (this.sText[this.nSimbolNumber] == " ")

	}
	_drawLines(nAlpha) {
		this.ctx.fillStyle = "rgba(0,255,0," + nAlpha + ")";

		//draw grid
		for (var i = 0; i<this.nCanvasHeight; i+=4) {
			this.ctx.fillRect(0, i, this.nCanvasWidth, 2);
		}
	}

	/**
	 * Main function for drawin all in the screen
	 */
	_drawConsole() {
		// clear canvas
		this.ctx.fillStyle = "#000000";
		this.ctx.fillRect(0, 0, this.nCanvasWidth, this.nCanvasHeight);

		// set main color to green
		this.ctx.fillStyle = this.mainColor;

		// print typed code
		this.oSymbol.x = 1;
		this.oSymbol.y = 1;

		for (var i = 0; i < this.aCode.length; i++) {
			for (var j = 0; j < this.aCode[i].length; j++) {
				this._printSymbol(this.aCode[i], j);
			}
			this.oSymbol.y++;
			this.oSymbol.x = 0;
		}

		// draw lines
		this._drawLines(this._randd(14, 16)/100);
	}


	_calculateFps(now) {
		var fps = 1000 / (now - this._lastAnimationFrameTime);
		this._lastAnimationFrameTime = now;
		//spf= 1/fps;

		var deltaTime=((now - this._last_time)/1000).toFixed(4);
		var spf=deltaTime;
		if(deltaTime>max_deltaTime&&deltaTime<2)
			var max_deltaTime=deltaTime;
		if(deltaTime<min_deltaTime||min_deltaTime==0)
			var min_deltaTime=deltaTime;

		//show_info("/"+now+" / "+lastFpsUpdateTime);

		if ((now - this._lastFpsUpdateTime)>1000) {
			this._lastFpsUpdateTime = now;

			//fpsElement.innerHTML = fps.toFixed(0) + ' fps';
			//show_vars();
		}

		this._last_time = now;


			fps = fps.toFixed(0);
		return fps;
	}
	_animate() {
		//var that = this;
		//this.requestId =
		if(this._isOn) {
			requestAnimationFrame(
				this._animate.bind(this)
				);
		}
		//var now = new Date();
		//this._calculateFps(now);
		this._drawConsole();
	}

	show() {
		$("body #" + this.sId).fadeIn();
		this._isOn = true;
		this._animate();
	}
	hide() {
		this._isOn = false;
		$(this.parentEl + " #" + this.sId).fadeOut();
	}
}
