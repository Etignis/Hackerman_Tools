class canvasConsole {
	constructor(parentEl, oParams){
		this.parentEl = (parentEl == undefined)? "body" : parentEl
		this.sId = "canvasConsole";
		this.sId_m = "canvasConsole_m";

		this.fontBase = 1000,                   // selected default width for canvas
		this.defaultFontSize = 14;              // default size for font

		this.fontRatio = 0.553; //0.6;

		var oConsole = "<canvas id='" + this.sId + "'  style='position: absolute; top: 0; left: 0; right: 0; bottom: 0'></canvas><input type='text' class='consoleInput'>";
		if(!($(this.parentEl + " #" + this.sId).length >0)) {
			$(this.parentEl).append(oConsole);
		}
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

		if(oParams && oParams.aSource) {
			this.sText = this._prepareSrc(oParams.aSource[this._randd(0, oParams.aSource.length-1)]);
		}

		this.mainColor = "rgba(0,255,0,.7)"; //"#00FF00";
		this.ctx.fillStyle = this.mainColor;

		this.oCode = {
			aLines: [""],
			aMonitorLines : [""]
		};
		this.nMaxStrings = 20;
		this.nMaxStringLength = 50;
		this.nMaxLineLength  = this.nMaxStringLength;
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

		this.cursor = "_";

		this._setAnimations();
		this._startCursor();

		// center code
		this.oCenterCode = new simpleContainer(this.ctx, {height: "100%", x: 600, y: 0, x2: -350});
		this.oCenterCode.start();

		// column diagram
		this.oColumnDiagram = new columnDiagram(this.ctx, {width: 300, height: 230, x: -20, y: 10});
		this.oColumnDiagram.start();

		// sin diagram
		this.oSinDiagram = new sinDiagram(this.ctx, {width: 300, height: 230, x: -20, y: 250});
		this.oSinDiagram.start();
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
	}
	_calculateLinesColumns() {
		this.nColumns = ~~(this.nCanvasWidth/(this.fontSize * this.fontRatio)); //number of columns
		this.nStrings = ~~(this.nCanvasHeight/this.lineHeight); //number of columns
		this.nMaxLineLength  = Math.min(this.nColumns, this.nMaxStringLength);
	}
	_getFont() {
	    var ratio = this.defaultFontSize / this.fontBase;   // calc ratio
	    this.fontSize = ~~(this.nCanvasWidth * ratio);   // get font size based on current width
	    this.lineHeight = ~~(this.fontSize * 1.2);
	    this.ctx.font = (this.fontSize|0) + 'px monospace'; // set font
	    this.ctx_m.font = (this.fontSize|0) + 'px monospace'; // set font
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
					["   [ SUCCESS ]", "    ╰(◕ᴥ◕)╯"]
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


	resizeWindow() {
		this._calculateConsoleParameters();

		this.c.height = this.nCanvasHeight;
		this.c.width = this.nCanvasWidth;

		this.c_m.height = this.nCanvasHeight;
		this.c_m.width = this.nCanvasWidth;

		this._getFont();
		this._calculateLinesColumns();
	}

	_prepareSrc(sSrc){
		return sSrc.replace(/<br>/ig, "\n");
	}


	_startCursor() {
		/**/
		this.cursorTimer = setInterval(function(){
			if(this.cursor == "_" || this.fCursor == false) {
				this.cursor = " ";
			} else {
				this.cursor = "_";
			}
		}.bind(this), 500);
		/**/
	}
	showCursor() {
		/**/
		this.tCursor = setTimeout(function(){
					this.fCursor = true;
					//caret();
				}.bind(this), 300);
				/**/
	}
	hideCursor() {
		/**/
		this.fCursor = false;
		clearTimeout(this.tCursor);
		/**/
	}
	_drawCursor() {
		/**/
		var nX = ~~((this.oSymbol.x +1) * (this.fontSize * this.fontRatio));
		var nY = ~~(this.oSymbol.y * (this.lineHeight));
		this.ctx.fillText(this.cursor, nX, nY);
		/**/
	}

	_printSymbol(sSrc, sNumber) {
		// var sSimbol = sSrc[sNumber];

		// var nX = ~~(this.oSymbol.x * (this.fontSize * this.fontRatio));
		// var nY = ~~(this.oSymbol.y * (this.lineHeight));

		// this.oSymbol.x++;
		// if(sSimbol == "\n"){
		// 	this.oSymbol.x = 0;
		// 	this.oSymbol.y++;
		// }
		// if(this.oSymbol.x > this.nColumns) {
		// 	this.oSymbol.x = 0;
		// 	this.oSymbol.y++;
		// }
		// if(this.oSymbol.y > this.nStrings)
		// 	this.oSymbol.y = 1;

		// this.ctx.fillText(sSimbol, nX, nY);
	}
	_printLine(sLine) {

		/*/
		for(var i=0; i<Math.ceil(sLine.length/this.nMaxLineLength); i++) {
			var sString = sLine.substr(i*this.nMaxLineLength, this.nMaxLineLength);
			var nX = 0;
			this.oSymbol.y += (i);
			var nY = ~~(this.oSymbol.y * this.lineHeight);
			this.ctx.fillText(sString, nX, nY);
			this.oSymbol.x = sString.length-1;
		}
		/**/

		var nX = 0;
		var nY = ~~(this.oSymbol.y * this.lineHeight);
		this.ctx.fillText(sLine, nX, nY);
		//this.ctx.strokeStyle = 'rgba(100,255,100,.2)';
		//this.ctx.strokeText(sLine, nX, nY);
		this.oSymbol.x = sLine.length-1;
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
						this.oCode.aLines.length + nAnimatonLines >= this.nMaxLineLength
					) &&
					nAnimatonLines-- > 0
				) {
					this.oCode.aLines.shift();
				}
			var nCurConsolePos = this.oCode.aLines.length;

			var timer = setInterval(
				function() {
					if (nCurFrame <= nMaxFrame) {
						if(this._randd(0, 5) == 1){
							for (var i=0; i<loader[nCurFrame].length; i++) {
								this.oCode.aLines[nCurConsolePos+i] = loader[nCurFrame][i];
								this._recalculateMonitorLines();
							}
							nCurFrame++;
						}
					} else {
						this.oCode.aLines.push("");
						this.fCursor = true;
						this.fAnimationActive = false;
						//this.oSymbol.y++;
						this.oSymbol.x = 0;
						this._recalculateMonitorLines();
						//this.oCode.aLines.push([""]);
						clearInterval(timer);
					}
				}.bind(this),
				50
			);
		}
	}
	_recalculateMonitorLines() {
		this.oCode.aMonitorLines = []
		this.oCode.aLines.forEach(function(sLine){
			for(var i=0; i<=Math.floor(sLine.length/this.nMaxLineLength); i++) {
				var sString = sLine.substr(i*this.nMaxLineLength, this.nMaxLineLength);
				this.oCode.aMonitorLines.push(sString);
			}
		}.bind(this));

		// delete extra lines
		while(this.oCode.aMonitorLines.length > this.nMaxStrings) {
			this.oCode.aMonitorLines.shift();
		}

		// for cursor
		this.oSymbol.y = this.oCode.aMonitorLines.length;
		this.oSymbol.x = 0;
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
				this.oCode.aLines.push([]);
				while (
						this.oCode.aLines.length >= this.nStrings ||
						this.oCode.aLines.length >= this.nMaxStrings
					) {
					this.oCode.aLines.shift();
				}
			} else {
				this.oCode.aLines[this.oCode.aLines.length - 1] += sSimbol;
			}

			this.nSimbolNumber++;

			if(this.nSimbolNumber >= this.sText.length)
				this.nSimbolNumber = 0;
		} while (this.sText[this.nSimbolNumber] == " ")

		// prepare lines for canvas
		this._recalculateMonitorLines();
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
		// this.oCode.aMonitorLines
		for (var i = 0; i < this.oCode.aMonitorLines.length; i++) {
			this.oSymbol.y++;
			this.oSymbol.x = 0;
			this._printLine(this.oCode.aMonitorLines[i]);

			// for (var j = 0; j < this.aCode[i].length; j++) {
			// 	this._printSymbol(this.aCode[i], j);

			// }
		}

		//draw cursor
		this._drawCursor();

		// column diagram
		this.oCenterCode.draw();

		// column diagram
		this.oColumnDiagram.drawDiagram();

		// sin diagram
		this.oSinDiagram.drawDiagram();

		// draw lines
		this._drawLines(this._randd(14,16)/100);

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
		if(this.isOn) {
			requestAnimationFrame(
				this._animate.bind(this)
				);
		}

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

class consoleWindow {
	constructor (oEl, oParams) {
		if(!oEl) {
			console.log("[ERROR]: I can't get canvas element! ")
			return false;
		}
		var aAlpha = shuffle("c3pod2rvalei97".split(""));
		this.ctx = oEl;
		this.title = aAlpha[0]+aAlpha[1]+"_"+aAlpha[2]+aAlpha[3];
		this.headerHeight = 30;
		this.width = 300;
		this.height = 230;
		this.pos = {
			x: 0,
			y: 0
		}

		this.timer = {
			main: null
		}

		if (oParams) {
			if(oParams.title) {
				this.title = oParams.title;
			}
			if(oParams.width) {
				this.width = oParams.width;
			}
			if(oParams.height) {
				if(typeof oParams.height == "number") {
					this.height = oParams.height;
				}
				if(/\d+%/.test(oParams.height)){
					this.height = this.ctx.canvas.clientHeight;
				}
			}
			if(oParams.x) {
				if(oParams.x<0) {
					this.pos.x = this.ctx.canvas.clientWidth - this.width + oParams.x;
				} else {
					this.pos.x = oParams.x;
				}
			}
			if(oParams.x2) {
				if(oParams.x2<0) {
					//this.pos.x = this.ctx.canvas.clientWidth - this.width + oParams.x;
					this.width = this.ctx.canvas.clientWidth - this.pos.x + oParams.x2;
				} else {
					//this.pos.x = oParams.x;
				}
			}
			if(oParams.y) {
				this.pos.y = oParams.y;
			}
		}
	}

	drawWindow () {
		//clear
		this.ctx.fillStyle = "#000000";
		this.ctx.strokeStyle="rgba(0,255,0, 0.5)";
		this.ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height);
		this.ctx.fillStyle = "rgba(0,255,0,0.05)";
		this.ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height);

		// draw rect
		this.ctx.lineWidth = 2;
		this.ctx.rect(this.pos.x, this.pos.y, this.width, this.height);
		this.ctx.stroke();

		this.ctx.beginPath();
		this.ctx.moveTo(this.pos.x, this.pos.y + this.headerHeight);
		this.ctx.lineTo(this.pos.x + this.width, this.pos.y + this.headerHeight);
		this.ctx.stroke();
		this.ctx.fillRect(this.pos.x, this.pos.y, this.width, this.headerHeight);

		// draw title
		this.ctx.fillStyle = "rgba(0,255,0,0.5)";
		this.ctx.fillText(this.title, this.pos.x+5, this.pos.y+this.headerHeight-10);
	}


	drawPanel() {
		this.ctx.strokeStyle="rgba(0,255,0, 0.5)";
		this.ctx.beginPath();

		// left line
		this.ctx.moveTo(this.pos.x, this.pos.y + 10);
		this.ctx.lineTo(this.pos.x, this.pos.y + this.height - 10);
		// right line
		this.ctx.moveTo(this.pos.x + this.width, this.pos.y  + 10);
		this.ctx.lineTo(this.pos.x + this.width, this.pos.y + this.height - 10)

		this.ctx.stroke();
	}
}

class columnDiagram extends consoleWindow {
	constructor(oEl, oParams) {
		super (oEl, oParams);

		this.nLinesNumber = 5;

		this.aLines = [
			{
				"x": 0,
				"y": 0,
				"l": 0,
				"w": 0
			}
		];

		this._init();
	}
	_init() {
		this.aLines = [];
		var nLineWidth = ~~((this.width-6) / this.nLinesNumber) - 10;
		var nLineMaxMax = ~~(this.height / 10)
		for (var i=0; i<this.nLinesNumber; i++) {
			var max = _randd(nLineMaxMax-5, nLineMaxMax-3)*10;
			var min =  _randd(2,3)*10;
			var l = _randd(min, max);
			this.aLines.push(
					{
						"x": this.pos.x + 4 + i * (nLineWidth+10) + ~~(nLineWidth/1.5),
						"y": this.pos.y + this.height -4,
						"l": l,
						"w": nLineWidth,
						"g": _randd(7,11),
						"max": max,
						"min": min,
						"f": true
					}
				);
		}
	}

	drawDiagram() {
		this.drawWindow();

		// draw
		this.drowLines();
		//this.drawAxis();
	}
	drowLines() {
		for (var i=0; i<this.nLinesNumber; i++) {
			this.drowLine(
				this.aLines[i].x,
				this.aLines[i].y,
				this.aLines[i].l,
				this.aLines[i].w,
				);
		}
	}

	drowLine(nX, nY, nLength, nWidth) {
		this.ctx.beginPath();
    this.ctx.lineWidth = nWidth;
    this.ctx.strokeStyle="rgba(0,255,0, 0.3)";
		this.ctx.moveTo(nX,nY);
		this.ctx.lineTo(nX,nY-nLength);
		this.ctx.stroke();
	}
	drawAxis() {
		// x
    this.ctx.lineWidth = 1;
    this.ctx.strokeStyle="green";
		this.ctx.beginPath();
		this.ctx.moveTo(this.pos.x+4, this.pos.y + this.height -4);
		this.ctx.lineTo(this.pos.x + this.width -4 , this.pos.y + this.height -4);
		this.ctx.stroke();

		// y
		this.ctx.beginPath();
		this.ctx.moveTo(this.pos.x+4, this.pos.y + this.height+4);
		this.ctx.lineTo(this.pos.x+4, this.pos.y-4);
		this.ctx.stroke();
	}

	animate() {
		for (var i=0; i<this.aLines.length; i++) {
			if (this.aLines[i].f) { // go up
				this.aLines[i].l += this.aLines[i].g;
			} else {								// go down
				this.aLines[i].l -= this.aLines[i].g;
			}

			// revers
			if(
					this.aLines[i].l > this.aLines[i].max
				) {
				this.aLines[i].f = !this.aLines[i].f;
				this.aLines[i].g = _randd(7,11);
				this.aLines[i].l = this.aLines[i].max;
			}
			if(
					this.aLines[i].l < this.aLines[i].min
				) {
				this.aLines[i].f = !this.aLines[i].f;
				this.aLines[i].g = _randd(7,11);
				this.aLines[i].l = this.aLines[i].min;
			}
		}
	}
	show() {

	}
	hide() {

	}
	start() {
		this.timer.main = setInterval(
			function() {
				this.animate();
				//this.drawDiagram();
			}.bind(this), 50);
	}
	stop() {
		clearInterval(this.timer.main);
	}
}

class sinDiagram extends consoleWindow {
	constructor(oEl, oParams) {
		super (oEl, oParams);

		this.nLinesNumber = 5;

		this.aLines = [
			{
				"x": 0,
				"y": 0,
				"l": 0,
				"w": 0
			}
		];
		this.points = [
				[0,0, 25,20, 50,-100, 75,100, 100,0],
				[0,20, 33,-30, 66,30, 100,-20],
				[0,-20, 20,10, 40,-60, 60,70, 80,-40, 100,50]
			];

		if(oParams) {
			if(oParams.lines) {
				this.points = lines;
			}
		}
		
		this.sin = {
			x: ~~(this.width/2),
			y: ~~(this.height/2),
			rad: Math.PI / 180,
			amplitude: [
				~~(this.height * 0.8),
				~~(this.height * 0.3)
				],
			frequency: [
				.01,
				.013
				],
			phi: 0,
			frames: 0
		};

		this._init();
	}
	_init() {
		this.canvasPoints = [];
		var fGrow = false;
		for(var j=0; j<this.points.length; j++){
			var aTmp = [];
			var aTmp1 = [];
			for(var i=0; i<this.points[j].length; i+=2) {
				let x = this.points[j][i];
				let y = this.points[j][i+1];
				aTmp.push({
					x: x,
					y: y,
					g: fGrow,
					f: false
				});
				aTmp1.push(x);
				aTmp1.push(y);
				fGrow = !fGrow;
			}
			this.points[j] = aTmp;
			this.canvasPoints[j] = aTmp1;
		}
	}

	drawDiagram() {
		this.drawWindow();

		// draw
		this.drawCurves();
		
		this.drawSin();
	}
	drawCurves() {
		this.canvasPoints.forEach(function(el) {
			this.drawCurve(this.ctx, el, this.tension);
		}.bind(this));
	}

	drawSin() {
				///// real sin
		
		this.sin.frames++
		if(this.sin.frames>6000) {
			this.sin.frames = 0;
		}
		this.sin.phi = this.sin.frames / 30;

		//this.ctx.clearRect(0, 0, cw, ch);
		this.ctx.beginPath();
		//this.ctx.strokeStyle = "hsl(" + frames + ",100%,50%)";
		//this.ctx.strokeStyle = "#00ff00";
		this.ctx.lineWidth = 2;
		//this.ctx.moveTo(this.pos.x, this.height);
		
		for(var w=0; w<this.sin.amplitude.length; w++) {
			this.ctx.beginPath();
			for (var x = this.pos.x; x < this.width + this.pos.x; x++) {
				var y = ~~(Math.sin(x * this.sin.frequency[w] + this.sin.phi) * this.sin.amplitude[w] / 2 + this.sin.amplitude[w] / 2 + this.headerHeight + this.pos.y + this.sin.y - this.sin.amplitude[w] / 1.8);
				//y = Math.cos(x * frequency + phi) * amplitude / 2 + amplitude / 2;
				this.ctx.lineTo(x, y); // 40 = offset

			}
			this.ctx.stroke();
		}
		//this.ctx.lineTo(this.width, this.height);
		//this.ctx.lineTo(this.pos.x, this.height);
		//requestId = window.requestAnimationFrame(Draw);
	}
	
	preparePoints(aPoi) {
		var kX = this.width/100;
		var kY1 = this.pos.y + (this.height - this.headerHeight)/2 + this.headerHeight;
		var kY2 =  -(this.height-this.headerHeight)/210 ;
		for(var j=0; j<this.points.length; j++)
			for(var i=0; i<this.points[j].length; i++) {
				let x = this.points[j][i].x;
				let y = this.points[j][i].y;

				this.canvasPoints[j][i*2]   = ~~(x * kX  + this.pos.x);
				this.canvasPoints[j][i*2+1] = ~~(y * kY2 + kY1);
			}
	}

	animate() {
		// change points
		for(var j=0; j<this.points.length; j++)
			for(var i=0; i<this.points[j].length; i++) {
				if(this.points[j][i].g) {
					this.points[j][i].y += _randd(1,4)*5;
				}	 else {
					this.points[j][i].y -= _randd(1,4)*5;
				}
				if (this.points[j][i].y > 95) {
					this.points[j][i].g = false;
				}
				if (this.points[j][i].y > 99) {
					this.points[j][i].y = 99;
				}
				if (this.points[j][i].y <-95) {
					this.points[j][i].g = true;
				}
				if (this.points[j][i].y <-99) {
					this.points[j][i].y = -99;
				}

				this.points[j][i].y = ~~(this.points[j][i].y);

				if(this.points[j][i].f && (i==0 || i==this.points[j].length-1)) {
					this.points[j][i].y = 0;
				}

			}

		// beautify points
		this.preparePoints();
		
		

	}
	start() {
		this.timer.main = setInterval(
			function() {
				this.animate();
				//this.drawDiagram();
			}.bind(this), 50);
	}
	stop() {
		clearInterval(this.timer.main);
	}




	drawCurve(ctx, ptsa, tension, isClosed, numOfSegments, showPoints) {
		ctx.beginPath();

		this.drawLines(ctx, this.getCurvePoints(ptsa, tension, isClosed, numOfSegments));

		if (showPoints) {
			ctx.beginPath();
			for(var i=0;i<ptsa.length-1;i+=2)
			  ctx.rect(ptsa[i] - 2, ptsa[i+1] - 2, 4, 4);
		}
		ctx.strokeStyle = "rgba(0,2550,0,0.3)";
		ctx.stroke();
	}

	getCurvePoints(pts, tension, isClosed, numOfSegments) {

	  // use input value if provided, or use a default value
	  tension = (typeof tension != 'undefined') ? tension : 0.5;
	  isClosed = isClosed ? isClosed : false;
	  numOfSegments = numOfSegments ? numOfSegments : 16;

	  var _pts = [], res = [],  // clone array
	      x, y,     // our x,y coords
	      t1x, t2x, t1y, t2y, // tension vectors
	      c1, c2, c3, c4,   // cardinal points
	      st, t, i;   // steps based on num. of segments

	  // clone array so we don't change the original
	  //
	  _pts = pts.slice(0);

	  // The algorithm require a previous and next point to the actual point array.
	  // Check if we will draw closed or open curve.
	  // If closed, copy end points to beginning and first points to end
	  // If open, duplicate first points to befinning, end points to end
	  if (isClosed) {
	    _pts.unshift(pts[pts.length - 1]);
	    _pts.unshift(pts[pts.length - 2]);
	    _pts.unshift(pts[pts.length - 1]);
	    _pts.unshift(pts[pts.length - 2]);
	    _pts.push(pts[0]);
	    _pts.push(pts[1]);
	  }
	  else {
	    _pts.unshift(pts[1]); //copy 1. point and insert at beginning
	    _pts.unshift(pts[0]);
	    _pts.push(pts[pts.length - 2]); //copy last point and append
	    _pts.push(pts[pts.length - 1]);
	  }

	  // ok, lets start..

	  // 1. loop goes through point array
	  // 2. loop goes through each segment between the 2 pts + 1e point before and after
	  for (i=2; i < (_pts.length - 4); i+=2) {
	    for (t=0; t <= numOfSegments; t++) {

	      // calc tension vectors
	      t1x = (_pts[i+2] - _pts[i-2]) * tension;
	      t2x = (_pts[i+4] - _pts[i]) * tension;

	      t1y = (_pts[i+3] - _pts[i-1]) * tension;
	      t2y = (_pts[i+5] - _pts[i+1]) * tension;

	      // calc step
	      st = t / numOfSegments;

	      // calc cardinals
	      c1 =   2 * Math.pow(st, 3)  - 3 * Math.pow(st, 2) + 1;
	      c2 = -(2 * Math.pow(st, 3)) + 3 * Math.pow(st, 2);
	      c3 =     Math.pow(st, 3)  - 2 * Math.pow(st, 2) + st;
	      c4 =     Math.pow(st, 3)  -     Math.pow(st, 2);

	      // calc x and y cords with common control vectors
	      x = c1 * _pts[i]  + c2 * _pts[i+2] + c3 * t1x + c4 * t2x;
	      y = c1 * _pts[i+1]  + c2 * _pts[i+3] + c3 * t1y + c4 * t2y;

	      //store points in array
	      res.push(x);
	      res.push(y);

	    }
	  }

	  return res;
	}

	drawLines(ctx, pts) {
	  ctx.moveTo(pts[0], pts[1]);
	  for(let i=2;i<pts.length-1;i+=2) ctx.lineTo(pts[i], pts[i+1]);
	}

}

class simpleContainer extends consoleWindow {
	constructor(oEl, oParams) {
		super (oEl, oParams);

		this.fontSize = this.ctx.font.split(' ')[0].match(/(\d+)px/i)[1];

		this.nColumns = ~~(this.width / (this.fontSize*0.6));

		this.sCodeSimbols = Array(10).join('A') +
												Array(10).join('B') +
												Array(10).join('C') +
												Array(10).join('D') +
												Array(10).join('E') +
												Array(10).join('F') +
												Array(10).join('0') +
												Array(10).join('1') +
												Array(10).join('2') +
												Array(10).join('3') +
												Array(10).join('4') +
												Array(10).join('5') +
												Array(10).join('6') +
												Array(10).join('7') +
												Array(10).join('8') +
												Array(10).join('9');
		this.aCodeSource = shuffle(this.sCodeSimbols.split(''));
		this.sCode = "";
		this.aCode = [];

		this.nCodeGroup = 6;
	}

	draw() {
		this.drawPanel();

		this.showCode();
	}

	showCode () {
		var nMaxLines = ~~((this.height - this.pos.y) / this.fontSize);
		while (this.aCode.length > nMaxLines-2) {
			this.aCode.shift();
		}
		for (var i=0; i < this.aCode.length; i++) {
				var nX = this.pos.x + 5;
				var nY = ~~(this.pos.y + i*this.fontSize);
				this.ctx.fillStyle = "rgba(0,250,10, 0.7)";
				this.ctx.fillText(this.aCode[i], nX, nY);
		}

	}

	animate() {
		var nMaxLines = ~~((this.height - this.pos.y) / this.fontSize);
		this.sCode += shuffle(this.aCodeSource).join("").substr(0, this.nCodeGroup*6);
		var nMaxSymbols = (this.nColumns * (nMaxLines-2));
		if(this.sCode.length > nMaxSymbols) {
			this.sCode = this.sCode.substr(this.sCode.length - nMaxSymbols);
		}
		//var a = this.aCode.split(/(\.{6})/);
		var nGroupsNumber = ~~(this.nColumns / (this.nCodeGroup+1));



		for( var i=0; (i < this.aCode.length || i < nMaxLines) && (i+1)*this.nColumns < this.sCode.length; i++) {
			var sFullString = this.sCode.substr(i*nGroupsNumber, nGroupsNumber*this.nCodeGroup);
			var aSubStrings =  sFullString.match(new RegExp('.{'+this.nCodeGroup+'}', 'g'));
			this.aCode[i] = aSubStrings.join(" ");
		}
	}

	start() {
		this.timer.main = setInterval(
			function() {
				this.animate();
			}.bind(this), 250);
	}
	stop() {
		clearInterval(this.timer.main);
	}

}
