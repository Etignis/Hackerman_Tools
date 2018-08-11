window.onload = function(){
	var nSimbol = 0;
	var sAlphabet = "0123456789ABCDEF";
	
	var currentCode, fCursor = true, tCursor, fAnimationActive = false, sLastSimbol="", oMatrix, fMatrix = false;
	
	function randd(min, max) {
	  return Math.floor(arguments.length > 1 ? (max - min + 1) * Math.random() + min : (min + 1) * Math.random());
	};
	function getFromAlphabet(){
		return sAlphabet[randd(0, sAlphabet.length-1)];
	}
	/////////// NASM 
	function create_nasm(){
		
		function getRegisters_inner(nRow, nColumn){ // 4 4 
			var aRows = [];
			for (var i=0; i<nRow; i++) {
				var aColumns = [];
				for(var j=0; j<nColumn; j++) {
					var sItem = "<td class='title'>AA</td><td class='cont'>0000</td>";
					aColumns.push(sItem);
				}
				aRows.push("<tr>"+aColumns.join("")+"</tr>");
			}
			return "<table id='tRegisters'>"+aRows.join("")+"</table>";
		}	

		function getMemory_inner(nRow){ // 8
			var aRows = [];
			for (var i=0; i<nRow; i++) {
				var sClass = (i==1)? " class='selected' ":"";
				var sItem = "<td class='addr'>011A</td><td class='data'>0000</td><td class='com'>ADD</td><td class='instr'>0000</td>";
				aRows.push("<tr "+sClass+">"+sItem+"</tr>");
			}
			return "<table id='tMemory'>"+aRows.join("")+"</table>";
		}	
		function getMemory_data_inner(nRow, nColumn){ // 10, 8
			var aRows = [];
			var sHeader = "<tr><td></td>", aHeader=[];
			
			for(var j=0; j<nColumn; j++) {
				aHeader.push("<td class='title'>"+j+"</td>");
			}
			sHeader+=aHeader.join("")+"</tr>";
			
			for (var i=0; i<nRow; i++) {
				var aColumns = [];
				var sTitle="<td class='title' style='padding-right: 2em'>DS:00"+((i<10)?"0"+i: i)+"</td>";
				for(var j=0; j<nColumn; j++) {
					var sItem = "<td class='cont'>"+getFromAlphabet()+getFromAlphabet()+"</td>";
					aColumns.push(sItem);
				}
				aRows.push("<tr>"+sTitle+aColumns.join("")+"</tr>");
			}
			return "<table id='tMemory_data'>"+sHeader+aRows.join("")+"</table>";
		}	

		
		
		var sRegisters = "<div class='flex_column registers'>"+getRegisters_inner(4,4)+"</div>";
		var sRegi_data = "<div class='flex_column reg_data'></div>";
		var sMemory = "<div class='flex_column memory'>"+getMemory_inner(8)+"</div>";
		var sMemory_data = "<div class='flex_column memory_data'>"+getMemory_data_inner(10,8)+"</div>";		
		var sData_table = "<div class='flex_column data_table'></div>";
		
		var sTopRow = "<div class='flex_row'>"+sRegisters+sRegi_data+"</div>";
		var sMidRow = "<div class='flex_row'>"+sMemory+sMemory_data+"</div>";
		var sBotRow = "<div class='flex_row'>"+sData_table+"</div>";
		
		var sNasm = sTopRow+sMidRow+sBotRow;
		
		return sNasm; 
	}
	/////////// /NASM
	function createConsole(oParams) {
		var sNasm = create_nasm();
		var oConsole = "<div id='console' class='console noselect'>\
      <div id='console_mainText'></div>\
      <div id='console_asm'>"+sNasm+"</div>\
      <div id='console_images'></div>\
    </div><input type='text' class='consoleInput'>";
		$("#wrapper").html(oConsole);
	}
	function sayHi() {
		fAnimationActive = true;
		fCursor = false;
		var s = "START TO PRINT...";
		var i=0, iMax = s.length;
		
		var timer = setInterval(function(){
			if(i<iMax) {
				typeSymbol(s, i, true);
			} else{
				if(i<iMax+4){
				} else {
					$("#console_mainText").empty();
					fCursor = true;
					fAnimationActive = false;
					clearInterval(timer);					
				}
			}
			i++;
		},
		60);
	}
	function scrollDown() {
		//$('#console_mainText').animate({scrollTop: $('#console_mainText').height()*2}, 'fast')
		$('#console_mainText').scrollTop($('#console_mainText')[0].scrollHeight * 1.2);
	}
	function printHackerText(){
		var sText = hackerText[randd(0, hackerText.length-1)].replace(/<br>/ig, "\n");

		for(var i=0; i<sText.length; i++) {
			typeSymbol(sText, i, true);
		}
	}
	function typeSymbol(sSrc, nNumber, extraClass, mainColor){
		var sSimbol = sSrc[nNumber];
		var nClass = randd(0, 30), sClass = "";
    var sMainClass, sGlowClass;
    if(!mainColor){
      mainColor = 'green';
    }
    switch(mainColor) {
      case "red": sMainClass="simbolError"; sGlowClass = "glowOutError"; break;
      default: sMainClass="simbol"; sGlowClass = "glowOut";
    }
		if(extraClass) {
			switch(nClass) {
				case 0: 
				case 1: 
				case 2: 
				case 3: sClass = "twinkle"; break;
				case 9: sClass = "glow"; break;
			}
			sClass += sGlowClass;
		}
		
		
		if(sSimbol == '\n') {
			deleteExtraCode();
			sSimbolLine = "<span class='br'><br></span>";
			//scrollDown();
		} else if(sSimbol == ' ') {
			sSimbolLine = "<span>&nbsp;</span>";
		} else {
			sSimbolLine = "<span class='"+sMainClass+" " + sClass + "'>" + sSimbol + "</span>";
		}
		
		$("#console_mainText").eq(0).append(sSimbolLine);
		scrollDown();
		return sSimbol;
	}
	function typeSring(sString) {
		for(var i=0; i<sString.length; i++){
			typeSymbol(sString, i, false);
		}
	}
	function printLine(){
		if(nSimbol >= currentCode.length)
			nSimbol = 0;
		sLastSimbol = typeSymbol(currentCode, nSimbol++, true);	
	}
	
	function showError() {
		var sText = alarmText[randd(0, alarmText.length-1)];
		fAnimationActive = true;
		//var s = "START TO PRINT...";
		var i=0, iMax = sText.length;
		typeSymbol("\n", 0);	
		
		var timer = setInterval(function(){
			if(i<iMax) {
				typeSymbol(sText, i, true);
			} else{		
				typeSymbol("\n", 0);
				typeSymbol("\n", 0);			
				fCursor = true;
				fAnimationActive = false;
				clearInterval(timer);
			}
			i++;
		},
		60);
	}
	function showAnimation() {
		fAnimationActive = true; 		
		fCursor = false;
		
		typeSymbol("\n", 0);
		typeSymbol("\n", 0);
		printHackerText();
		typeSymbol("\n", 0);
		var loader = animation[randd(0, animation.length-1)];//animation[randd(0, animation.length-1)]; //animation[animation.length-1] //
		var bCurFrame = 0, nMaxFrame = loader.length-1;
		var nCurConsolePos = $("#console_mainText span").length-1;
		if(nCurConsolePos < 0)
			nCurConsolePos = 0;
		var timer = setInterval(
			function() {	
				fCursor = false;
				if (bCurFrame <= nMaxFrame) {
					if(randd(0, 5) == 1){
						for ( var i=0; $("#console_mainText span").eq(nCurConsolePos).length>0 && i<10000; i++) {
							$("#console_mainText span").eq(nCurConsolePos).remove();
						}

						var sCurFrame = loader[bCurFrame].replace(/<br>/ig, "\n")
						for(var i=0; i<sCurFrame.length; i++) {
							typeSymbol(sCurFrame, i, false);
						}
						bCurFrame++;
						//scrollDown();
					}
				} else {					
					fCursor = true;
					fAnimationActive = false;
					//scrollDown();
					clearInterval(timer);
				}
			},
			50
		);
	}
	
	function showLoader() {
		typeSymbol("\n", 0, false);
		
		var oL = {
			0: "▖▗▘▖▗▘",
			1: "▚▚",
			2: "▜▜▙▟",
			3: "▇"
		}
		var nCurConsolePos = $("#console_mainText span").length-1;
		
		var oPattern= [
			"0",
			"10",
			"210",
			"3210",
			"332100",
			"333210",
			"3333210",
			"33333210",
			"3333332100",
			"3333333210",
			"33333333210",
			"33333333321",
			"33333333332",
			"33333333333"
		]
		
		function doPrint(nS){
			return oL[nS][randd(0, oL[nS].length-1)];
		}
		
		var nLength = oPattern[oPattern.length-1].length;
		var that = this;
		
		var i = 0;
		var oTimer = setInterval(function(){
			if (randd(0,1) >0) {
				for ( var l=0; $("#console_mainText span").eq(nCurConsolePos).length>0 && l<10000; l++) {
					$("#console_mainText span").eq(nCurConsolePos).remove();
				}
				var j=i
				var k=0;
				do{
					typeSymbol(doPrint(oPattern[i][k++]), 0, false);
				} while(oPattern[i][k]);
				
				if(i > nLength+1) {
					typeSring("      ✔ DONE\n");
					clearInterval(oTimer);
				}
				i++;
			}
		}, 50);
			
	}
	
	function deleteExtraCode() {
		var nFontSize = parseInt($("#console_mainText span").eq(0).css('font-size'));
		var nConsoleHeight = $("#console_mainText").height();
		var nMaxLine = Math.floor((nConsoleHeight / nFontSize));
		if($("#console_mainText .br").length > nMaxLine * 2) {
			for (var i=0; i<nMaxLine; ) {
				var sSp = $("#console_mainText span").eq(0);
				if(sSp.hasClass("br")) {
					i++;
				}
				sSp.remove();
			}
		}	
	}
	
	function caret() {
		/*/
		if(fCursor) {
			if(!($("#console_mainText #caret").length > 0)){
				$("#console_mainText").append("<span id='caret' class='caret'></span>");
			}
		}
		/**/
		/**/
		setInterval(function() {
			if(fCursor) {
				if($("#console_mainText #caret").length > 0) {
					//$("#console_mainText #caret").remove();
				} else {
					$("#console_mainText").append("<span id='caret' class='caretHor'></span>");
				}
			} else {
				$("#console_mainText #caret").remove();
			}
		}, 100);
		/**/
	}
	function prepareSrc(sSrc){
		return sSrc.replace(/<br>/ig, "\n");
	}
	
	function fullScreen(el) {
		if (el.requestFullscreen) {
			el.requestFullscreen();
		} else if (el.msRequestFullscreen) {
			el.msRequestFullscreen();
		} else if (el.mozRequestFullScreen) {
			el.mozRequestFullScreen();
		} else if (el.webkitRequestFullscreen) {
			el.webkitRequestFullscreen();
		}
	}
	function exitFullScreen() {
		if (document.exitFullscreen) {
			document.exitFullscreen();
		} else if (document.webkitExitFullscreen) {
			document.webkitExitFullscreen();
		} else if (document.mozCancelFullScreen) {
			document.mozCancelFullScreen();
		} else if (document.msExitFullscreen) {
			document.msExitFullscreen();
		}
	}
	function isFullscreen() {
	 if (document.fullscreenElement
	  || document.webkitFullscreenElement
	  || document.mozFullScreenElement
	  || document.msFullscreenElement) {
		return true;
		}
    }
	
	function type(e){
		clearTimeout(tCursor);
		fCursor = false;
				
		if (!fAnimationActive) {
			var code = e.keyCode || e.which;
			if(code == 13) { //Enter keycode
				// end line
				while (sLastSimbol != "\n") {
					printLine();
				}
				// show loader
				showAnimation();
			} else if (code == 16){ // shift ?
				// end line
				while (sLastSimbol != "\n") {
					printLine();
				}
				// show error
				showError();
			} else if (code == 20){ // caps 
				// end line
				while (sLastSimbol != "\n") {
					printLine();
				}
				// show matrix
				if(fMatrix) {
					fMatrix = false;
					oMatrix.hide();
					fCursor = true;
				} else {
					fMatrix = true;
					oMatrix.show();
				}
			} else if (code == 17) { // ctrl
				// end line
				while (sLastSimbol != "\n") {
					printLine();
				}
				showLoader();
			} else if (code == 38 || code == 122) { // up f11
				e.preventDefault();
				if(isFullscreen()){
					exitFullScreen();
				} else {
					var o = document.getElementById('wrapper');
					try{ 
						fullScreen(o);
					} catch (err) {}
				}
				fCursor = true;
			} else {		
				do { 
					printLine();
				} while (sLastSimbol == " ") 
				
				tCursor = setTimeout(function(){
					fCursor = true;
					//caret();
				}, 500);
			}
				
		}			
		//return false;
	}

	
	function init() {
		currentCode = prepareSrc(code[randd(0, code.length-1)]);
		createConsole();
		caret();
		sayHi();
		oMatrix = new matrixRain("#wrapper");
		$(".consoleInput").focus();
	}
	init();
	
	// type
	$("body").on('keyup', function(e){
		//type(e);
	});
	
	$("body").on('click', function(e){
		$(".consoleInput").focus();
	});
	
	$(".consoleInput").on('keydown', function(e){
		$(".consoleInput").val("");
		type(e);
		//return false;
	});
	
}; 