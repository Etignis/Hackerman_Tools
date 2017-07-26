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
		this.nMaxStringLength = 60;
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

		// column diagram
		this.oColumnDiagram = new columnDiagram(this.ctx, {width: 300, height: 230, x: 700, y: 10});
		this.oColumnDiagram.start();
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
		this.oColumnDiagram.drawDiagram();

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
		this.ctx = oEl;
		this.title = "sr_293";
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
				this.height = oParams.height;
			}
			if(oParams.x) {
				this.pos.x = oParams.x;
			}
			if(oParams.y) {
				this.pos.y = oParams.y;
			}
		}
	}

	drawWindow () {
		//clear
		this.ctx.fillStyle = "#001000";
    this.ctx.strokeStyle="rgba(0,255,0, 0.5)";
		this.ctx.fillRect(this.pos.x, this.pos.y, this.width, this.heught);

		//this._drawHeader();
		//this._drawBody();

		// draw rect
    this.ctx.lineWidth = 2;
		this.ctx.rect(this.pos.x, this.pos.y, this.width, this.height);
		this.ctx.stroke();

		this.ctx.beginPath();
		this.ctx.moveTo(this.pos.x, this.pos.y + 30);
		this.ctx.lineTo(this.pos.x + this.width, this.pos.y + 30);
		this.ctx.stroke();
		this.ctx.fillStyle = "rgba(0,255,0,0.1)";
		this.ctx.fillRect(this.pos.x, this.pos.y, this.width, 30);

		// fraw title
		this.ctx.fillStyle = "rgba(0,255,0,0.8)";
		this.ctx.fillText(this.title, this.pos.x+5, this.pos.y+20);
	}
	_drawHeader() {
		// draw rect
		this.ctx.rect(this.pos.x, this.pos.y, this.width, 30);
		this.ctx.stroke();
		this.ctx.fill();
	}
	_drawBody() {
		// draw rect
		this.ctx.rect(this.pos.x, this.pos.y, this.width, this.height - 30);
		this.ctx.stroke();

	}
}

class roundRadar {
	constructor(oEl) {
		this.ctx = oEl;
		this.radius = 30;
		this.pos = {
			x: 300,
			y: 50
		}
	}
	printRadar() {
		// clear

		//
		this._drawScanLine();
		this._drawGrid();
	}
	_drawScanLine() {

	}
	_drawGrid() {
      var context = this.ctx;
      var centerX = this.pos.x;
      var centerY = this.pos.y;
      var radius = this.radius;

      context.beginPath();
      context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
      context.lineWidth = 2;
      context.strokeStyle = '#003300';
      context.stroke();
	}
	start() {

	}
	stop() {

	}
	show() {

	}
	hide() {

	}
}

class sinDiagram {
	constructor(oEl) {
		this.ctx = oEl;
		this.pos = {
			x: 0,
			y: 0
		}
		this.width = 200;
		this.heught = 150;
		this.timer = {
			main: null
		}

		this.linePoints = {};
		this.lineCounter = 0;
	}

	drawDiagram() {
		this.drowLines();
		this.drawAxis();
	}
	drowLines() {

	}
	_f(x) {
    return 50 * Math.sin(0.1 * x) + 50;
	}
	drowLine() {
		var ctx = this.ctx;
    ctx.lineWidth = 3;			///
    var x = 0,
        y = _f(0);
    var timeout = setInterval(function() {
        if(this.lineCounter < 100) { // If it doesn't need to move, draw like you already do
            ctx.beginPath();
            ctx.moveTo(x, y);
            this.linePoints[x] = y;
            x += 1;
            y = _f(x);
            ctx.lineTo(x, y);
            ctx.stroke();
            if (x > 1000) {
                clearInterval(timeout);
            }
        } else { // The moving part...
            ctx.clearRect(0, 0, 100, 100); // Clear the canvas
            ctx.beginPath();
            this.linePoints[x] = y;
            x += 1;
            y = _f(x);
            for(var i = 0; i < 100; i++) {
                // Draw all lines through points, starting at x = i + ( counter - 100 )
                // to x = counter. Note that the x in the canvas is just i here, ranging
                // from 0 to 100
                ctx.lineTo(i, this.linePoints[i + this.lineCounter - 100]);
            }
            ctx.stroke();
        }
        this.lineCounter++;
    }, 10);
	}
	drawAxis() {

	}
	show() {

	}
	hide() {

	}
	start() {

	}
	stop() {

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
				this.drawDiagram();
			}.bind(this), 50);
	}
	stop() {
		clearInterval(this.timer.main);
	}
}
