class canvasConsole {
	constructor(parentEl, oParams){
		this.parentEl = (parentEl == undefined)? "body" : parentEl
		this.sId = "canvasConsole";
		this.sId_m = "canvasConsole_m";

		this.fontBase = 1000,                   // selected default width for canvas
    this.defaultFontSize = 14;                     // default size for font


		//this.fontSize = 16;
		this.fontRatio = 0.553; //0.6;


		//this._calculateConsoleParameters();

		//var oConsole = "<canvas id='" + this.sId + "' width='" + this.nCanvasWidth + "' height='" + this.nCanvasHeight + "'></canvas><input type='text' class='consoleInput'>";
		var oConsole = "<canvas id='" + this.sId + "'  style='position: absolute; top: 0; left: 0; right: 0; bottom: 0'></canvas><input type='text' class='consoleInput'>";
		if(!($(this.parentEl + " #" + this.sId).length >0)) {
			$(this.parentEl).append(oConsole);
		}

		//var oMonitorConsole = "<canvas id='" + this.sId_m + "' width='" + this.nCanvasWidth + "' height='" + this.nCanvasHeight + "' style='position: absolute; top: 0; left: 0;'></canvas>";
		var oMonitorConsole = "<canvas id='" + this.sId_m + "' style='position: absolute; top: 0; left: 0; right: 0; bottom: 0'></canvas>";
		if(!($(this.parentEl + " #" + this.sId_m + "").length >0)) {
			$(this.parentEl).append(oMonitorConsole);
			//$(parentEl + " #" + this.sId).hide();
		}

		this.c = document.getElementById(this.sId);
		this.c_m = document.getElementById(this.sId_m);
		this.ctx = this.c.getContext("2d");
		this.ctx_m = this.c_m.getContext("2d");

		this.resizeWindow();

		this.oTimer;

		//this.ctx.font = this.fontSize + "px monospace";
		//this.ctx.font = this.fontSize + 'px monospace'; // set font
	  //this.ctx_m.font = this.fontSize + 'px monospace'; // set font

		if(oParams && oParams.aSource) {
			this.sText = this._prepareSrc(oParams.aSource[this._randd(0, oParams.aSource.length-1)]);
		}


		this.mainColor = "rgba(0,255,0,.9)"; //"#00FF00";
		this.ctx.fillStyle = this.mainColor;
		this.aCode = [""];
		this.nMaxStrings = 10;
		this._lastAnimationFrameTime = 0;
		this._lastFpsUpdateTime = 0;
		this._last_time = 0;
		this.isOn = true;

		this.elapsed = 0;
		this.now =0;
		this.then = 0;
		this.fpsInterval = 0;

		this.oSymbol = {
			x: 0,
			y: 1
		};

		this._setAnimations();
		this._startCursor();
	}
	_randd(min, max) {
		return Math.floor(Math.random() * (max - min )) + min;
	}

	_calculateConsoleParameters() {
		this.nCanvasWidth = window.innerWidth
			|| document.documentElement.clientWidth
			|| document.body.clientWidth;
		this.nCanvasHeight = window.innerHeight
			|| document.documentElement.clientHeight
			|| document.body.clientHeight;

		this.nColumns = ~~(this.nCanvasWidth/(this.fontSize * this.fontRatio)); //number of columns
		this.nStrings = ~~(this.nCanvasHeight/this.lineHeight); //number of columns
	}
	_setAnimations() {
		this.animations = [
			 	[
					["   ╔════════════════════╗", "   ║                    ║", "   ╚════════════════════╝"],
					["   ╔════════════════════╗", "   ║█                   ║", "   ╚════════════════════╝"],
					["   ╔════════════════════╗", "   ║██                  ║", "   ╚════════════════════╝"],
					["   ╔════════════════════╗", "   ║███                 ║", "   ╚════════════════════╝"],
					["   ╔════════════════════╗", "   ║████                ║", "   ╚════════════════════╝"],
					["   ╔════════════════════╗", "   ║█████               ║", "   ╚════════════════════╝"],
					["   ╔════════════════════╗", "   ║██████              ║", "   ╚════════════════════╝"],
					["   ╔════════════════════╗", "   ║███████             ║", "   ╚════════════════════╝"],
					["   ╔════════════════════╗", "   ║████████            ║", "   ╚════════════════════╝"],
					["   ╔════════════════════╗", "   ║█████████           ║", "   ╚════════════════════╝"],
					["   ╔════════════════════╗", "   ║██████████          ║", "   ╚════════════════════╝"],
					["   ╔════════════════════╗", "   ║███████████         ║", "   ╚════════════════════╝"],
					["   ╔════════════════════╗", "   ║████████████        ║", "   ╚════════════════════╝"],
					["   ╔════════════════════╗", "   ║█████████████       ║", "   ╚════════════════════╝"],
					["   ╔════════════════════╗", "   ║██████████████      ║", "   ╚════════════════════╝"],
					["   ╔════════════════════╗", "   ║███████████████     ║", "   ╚════════════════════╝"],
					["   ╔════════════════════╗", "   ║████████████████    ║", "   ╚════════════════════╝"],
					["   ╔════════════════════╗", "   ║█████████████████   ║", "   ╚════════════════════╝"],
					["   ╔════════════════════╗", "   ║██████████████████  ║", "   ╚════════════════════╝"],
					["   ╔════════════════════╗", "   ║███████████████████ ║", "   ╚════════════════════╝"],
					["   ╔════════════════════╗", "   ║████████████████████║", "   ╚════════════════════╝"],
					["   ╔════════════════════╗", "   ║       SUCCESS      ║", "   ╚════════════════════╝"]
				],
				[
					[" ", "     (o_O)"],
					[" ", "     (O_o)"],
					[" ", "     (O_o)"],
					[" ", "     (o_O)"],
					[" ", "     (o_O)"],
					[" ", "     (O_o)"],
					[" ", "     (O_o)"],
					[" ", "     (o_O)"],
					[" ", "     (o_O)"],
					[" ", "     (O_o)"],
					[" ", "     (O_o)"],
					[" ", "     (O_o)"],
					[" ", "     (O_o)"],
					[" ", "     (o_O)"],
					[" ", "     (o_O)"],
					[" ", "     (0_0)"],
					[" ", "     (0_0)"],
					["  [ SUCCESS ]", "    ╰(◕ᴥ◕)╯"]
				],
				[
					["    )\\_/(", "    'o.o'", "   =(___)=", "      U"],
					["    )\\_/(", "    'o.o'", "   =(___)=", "      U"],
					["    _ _/(", "   \\'o.o'", "   =(___)=", "      U"],
					["    _ _/(", "   \\'o.o'", "   =(___)=", "      U"],
					["    )\\_/(", "    'o.o'", "   =(___)=", "      U"],
					["    )\\_/(", "    'o.o'", "   =(___)=", "      U"],
					["    _ _/(", "   \\'o.o'", "   =(___)=", "      U"],
					["    _ _/(", "   \\'o.o'", "   =(___)=", "      U"],
					["    )\\_/(", "    'o.o'", "   =(___)=", "      U"],
					["    )\\_/(", "    'o.o'", "   =(___)=", "      U"],
					["    _ _/(", "   \\'o.o'", "   =(___)=", "      U"],
					["    _ _/(", "   \\'o.o'", "   =(___)=", "      U"],
					["    (\\_/)   .[DONE]", "   =(^ᴥ^)= `", "    (___)", "      U "]
				]
		];
	}
	_getFont() {
	    var ratio = this.defaultFontSize / this.fontBase;   // calc ratio
	    this.fontSize = ~~(this.nCanvasWidth * ratio);   // get font size based on current width
	    this.lineHeight = ~~(this.fontSize * 1.2);
	    this.ctx.font = (this.fontSize|0) + 'px monospace'; // set font
	    this.ctx_m.font = (this.fontSize|0) + 'px monospace'; // set font
	}

	resizeWindow() {
		this._calculateConsoleParameters();

		this.c.height = this.nCanvasHeight;
		this.c.width = this.nCanvasWidth;

		this.c_m.height = this.nCanvasHeight;
		this.c_m.width = this.nCanvasWidth;

		this._getFont();
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
	_printLine(sLine) {

		for(var i=0; i<Math.ceil(sLine.length/this.nColumns); i+=this.nColumns) {
			var sString = sLine.substr(i, i+this.nColumns);
			var nX = 0;
			var nY = ~~(this.oSymbol.y * (this.lineHeight));
			this.ctx.fillText(sString, nX, nY);
			this.oSymbol.x = sString.length-1;
		}
	}
	endLine() {
		while (this.sText[this.nSimbolNumber] != "\n"){
			this.type();
		}
	}
	showAnimation(){
		if(!this.fAnimationActive) {
			this.fAnimationActive = true;
			this.fCursor = false;


			var loader = this.animations[this._randd(0, this.animations.length)];
			var nCurFrame = 0, nMaxFrame = loader.length-1;

			var nAnimatonLines = loader[0].length;

			while (
							(
								this.aCode.length + nAnimatonLines >= this.nStrings ||
								this.aCode.length + nAnimatonLines >= this.nMaxStrings
							) &&
							nAnimatonLines-- > 0
						) {
						this.aCode.shift();
					}
			var nCurConsolePos = this.aCode.length;

			var timer = setInterval(
				function() {
					if (nCurFrame <= nMaxFrame) {
						if(this._randd(0, 5) == 1){
							for (var i=0; i<loader[nCurFrame].length; i++) {
								this.aCode[nCurConsolePos+i] = loader[nCurFrame][i]
							}
							nCurFrame++;
						}
					} else {
						this.aCode.push([]);
						this.fCursor = true;
						this.fAnimationActive = false;
						clearInterval(timer);
					}
				}.bind(this),
				50
			);
		}
	}

	_startCursor() {
		this.cursor = " ";
		this.cursorTimer = setInterval(function(){
			if(this.cursor == "_" || this.fCursor == false) {
				this.cursor = " ";
			} else {
				this.cursor = "_";
			}
		}.bind(this), 500);
	}
	showCursor() {
		this.tCursor = setTimeout(function(){
					this.fCursor = true;
					//caret();
				}.bind(this), 300);
	}
	hideCursor() {
		this.fCursor = false;
		clearTimeout(this.tCursor);
	}
	_drawCursor() {
		var nX = ~~((this.oSymbol.x +1) * (this.fontSize * this.fontRatio));
		var nY = ~~(this.oSymbol.y * (this.lineHeight));
		this.ctx.fillText(this.cursor, nX, nY);
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
				while (
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
	_emulateCRT() {
		var oCanvasSource = this.ctx.getImageData(0, 0, this.nCanvasWidth, this.nCanvasHeight);
		var oSourcePixels = oCanvasSource.data;
		var oCanvasResult = this.ctx_m.getImageData(0, 0, this.nCanvasWidth, this.nCanvasHeight);
		var oResultPixels = oCanvasResult.data;

		for (var i = 0, n = oSourcePixels.length; i < n; i += 4){
		    oResultPixels[i  ] = oSourcePixels[i  ]; // red
		    oResultPixels[i+1] = oSourcePixels[i+1]; // green
		    oResultPixels[i+2] = oSourcePixels[i+2]; // blue
		    oResultPixels[i+3] = oSourcePixels[i+3];       // alpha
		}
		this.ctx_m.putImageData(oCanvasResult, 0, 0);
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
		this.oSymbol.x = 0;
		this.oSymbol.y = 0;

		for (var i = 0; i < this.aCode.length; i++) {
			this.oSymbol.y++;
			this.oSymbol.x = 0;
			this._printLine(this.aCode[i]);

			// for (var j = 0; j < this.aCode[i].length; j++) {
			// 	this._printSymbol(this.aCode[i], j);

			// }
		}
		//draw cursor
		this._drawCursor();


		// draw lines
		this._drawLines(this._randd(14, 16)/100);

		// emulate CRT monitor
		this._emulateCRT();
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
		if(this.isOn) {
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
		this.isOn = true;
		this._animate();
	}
	hide() {
		this.isOn = false;
		$(this.parentEl + " #" + this.sId).fadeOut();
	}
}
