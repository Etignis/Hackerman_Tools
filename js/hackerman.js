window.onload = function(){
	var nSimbol = 0;
	var sAlphabet = "0123456789ABCDEF";
	var aInst = [
		"ADD",
		"AND",
		"DAS",
		"DEC",
		"DIV",
		"JMP",
		"MOV"		
	];
	var currentCode, fCursor = true, tCursor, fAnimationActive = false, sLastSimbol="", oMatrix, fMatrix = false;
	
	var oNasmTimer;
	
	function randd(min, max) {
	  return Math.floor(arguments.length > 1 ? (max - min + 1) * Math.random() + min : (min + 1) * Math.random());
	};
	function getFromAlphabet(){
		return sAlphabet[randd(0, sAlphabet.length-1)];
	}
	function getFromInstr(){
		return aInst[randd(0, aInst.length-1)];
	}
	/////////// NASM 
	function updateNasm(){
		// sinus
		var sSin = sin("columns");
		$("#tRegisters_data").html(sSin);
		
		// registers
		$("#tRegisters").find(".cont").each(function(){
			if(randd(-4,2)>0) {
				$(this).text(getFromAlphabet()+getFromAlphabet()+getFromAlphabet()+getFromAlphabet());
			}
		});
		
		// memory
		if(randd(-6,2)>0) {
			$("#tMemory .row").removeClass("selected");
			var nRand = randd(0,$("#tMemory .row").length-1);
			$("#tMemory .row").eq(nRand).addClass("selected");
			
			$("#tMemory .row").eq(nRand).find(".addr").text(getFromAlphabet()+getFromAlphabet()+getFromAlphabet()+getFromAlphabet());
			$("#tMemory .row").eq(nRand).find(".data").text(getFromAlphabet()+getFromAlphabet()+getFromAlphabet()+getFromAlphabet());
			$("#tMemory .row").eq(nRand).find(".com").text(getFromInstr());
			$("#tMemory .row").eq(nRand).find(".instr").text(getFromAlphabet()+getFromAlphabet()+getFromAlphabet()+getFromAlphabet());
		}
		
		//data data		
		$("#tData_data").find(".cont").each(function(){
			if(randd(-4,2)>0) {
				$(this).text(getFromAlphabet()+getFromAlphabet());
			}
		});
		
		//memory data		
		$("#tMemory_data").find(".cont").each(function(){
			if(randd(-4,2)>0) {
				$(this).text(getFromAlphabet()+getFromAlphabet());
			}
		});
		
		// sys load
		$("#tSysLoad").find(".flex_row").each(function(){
			if(randd(-10,2)>0) {
				$(this).find("div").eq(1).html(get_sim_load());
			}
		});
		
		// users
		if(randd(-6,2)>0) {
			$("#tUsers .row").removeClass("selected");
			var nRand = randd(0,$("#tUsers .row").length-1);
			$("#tUsers .row").eq(nRand).addClass("selected");
			var oDate = new Date();
			$("#tUsers .row").eq(nRand).find(".user").text("user_"+randd(0,9)+randd(0,9));
			$("#tUsers .row").eq(nRand).find(".pid").text(getFromAlphabet()+getFromAlphabet()+getFromAlphabet()+getFromAlphabet());
			$("#tUsers .row").eq(nRand).find(".cpu").text((randd(1,1000)/100)+"%");
			$("#tUsers .row").eq(nRand).find(".mem").text((randd(1,1000)/100)+"%");
			$("#tUsers .row").eq(nRand).find(".time").text(oDate.getHours()+":"+oDate.getMinutes()+":"+oDate.getSeconds());
			$("#tUsers .row").eq(nRand).find(".command").text(getFromInstr());
		}
	}
	function create_nasm(){
		
		function getRegisters_inner(nRow, nColumn){ // 4 4 
			var aRows = [];
			for (var i=0; i<nRow; i++) {
				var aColumns = [];
				for(var j=0; j<nColumn; j++) {
					var sItem = "<div class='title'>"+getFromAlphabet()+getFromAlphabet()+"</div><div class='cont'>0000</div>";
					aColumns.push(sItem);
				}
				aRows.push("<div class='row'>"+aColumns.join("")+"</div>");
			}
			return "<div class='flex_column registers' id='tRegisters'>"+aRows.join("")+"</div>";
		}	
		function getRegisters_data_inner(){ // 4 4 			
			return "<div class='flex_column registers hideMax' id='tRegisters_data'>"+sin("columns")+"</div>";
		}	

		function getMemory_inner(nRow){ // 8
			var aRows = [];
			for (var i=0; i<nRow; i++) {
				var sClass = (i==1)? " selected ":"";
				var sItem = "<div class='addr'>011A</div><div class='data'>0000</div><div class='com'>ADD</div><div class='instr'>0000</div>";
				aRows.push("<div class=' row"+sClass+"'>"+sItem+"</div>");
			}
			return "<div class='flex_column memory' id='tMemory'>"+aRows.join("")+"</div>";
		}	
		
		function getMemory_data_inner(nRow, nColumn){ // 10, 8
			var aRows = [];
			var sHeader = "<div class='row'><div class='title t1'></div>", aHeader=[];
			
			for(var j=0; j<nColumn; j++) {
				aHeader.push("<div class='title'>"+j+"</div>");
			}
			sHeader+=aHeader.join("")+"</div>";
			
			for (var i=0; i<nRow; i++) {
				var aColumns = [];
				var sTitle="<div class='title t1'>DS:00"+((i<10)?"0"+i: i)+"</div>";
				for(var j=0; j<nColumn; j++) {
					var sItem = "<div class='cont'>"+getFromAlphabet()+getFromAlphabet()+"</div>";
					aColumns.push(sItem);
				}
				aRows.push("<div class='row'>"+sTitle+aColumns.join("")+"</div>");
			}
			return "<div class='flex_column memory_data hideMax' id='tMemory_data'>"+sHeader+aRows.join("")+"</div>";
		}	

		function getData_inner(nRow, nGroups){ // 5, 2 (16)
			var nColumn = 8;
			//var nGroups = Math.ceil(nColumn/8);
			var aRowsTitles = ["<div class='title t1'>&nbsp;</div>"];
			for (var i=0; i<nRow; i++) {
				var aColumns = [];
				var sTitle="<div class='title t1'>DS:00"+((i<10)?"0"+i: i)+"</div>";
				
				aRowsTitles.push(sTitle);
			}
				
			var aGroups=[];
			
			for(var k=0; k<nGroups; k++){				
				var sHeader = "<div class='row'>", aHeader=[];
				for(var j=0; j<nColumn; j++) {
					var sTit = (sAlphabet[j+nColumn*k] || j+nColumn*k);
					if(sTit.length<2) {
						sTit = "&nbsp;"+sTit;
					}
					aHeader.push("<div class='title'>"+sTit+"</div>");
				}
				sHeader+=aHeader.join("")+"</div>";
				
				var aRows = [];
				for (var i=0; i<nRow; i++) {
					var aColumns = [];
					for(var j=0; j<nColumn; j++) {
						var sItem = "<div class='cont'>"+getFromAlphabet()+getFromAlphabet()+"</div>";
						aColumns.push(sItem);
					}
					aRows.push("<div class='row'>"+aColumns.join("")+"</div>");
				}
								
				sClass = (k>0)? " hideMax" : "";
				aGroups.push("<div class='column"+sClass+"'>"+sHeader + aRows.join("") +"</div>");
			};
			
			
			return "<div class='flex_column data_data' id='tData_data'><div>"+aRowsTitles.join("")+"</div>"+aGroups.join("")+"</div>";
		}	
		
		function get_sys_load(){
			var sRet="";
			var aLines = [
				"Mem",
				"Sys",
				"Dat",
				"Wtf"
			];
			var aNewLines = aLines.map(function(sTit){
				return "<div class='flex_row'><div>"+sTit+": </div><div>"+get_sim_load()+"</div></div>";
			});
			sRet = "<div class='flex_column' id='tSysLoad'>"+aNewLines.join("")+"</div>";
			return sRet;
		}
		function get_users(nRow){ //8
			var aRows = [];
			for (var i=0; i<nRow; i++) {
				var sClass = (i==1)? " selected ":"";
				var sItem = "<div class='user'>user_00</div><div class='pid'>0000</div><div class='cpu'>10.0</div><div class='mem'>0.4</div><div class='time'>3:00:00</div><div class='command'>AXX</div>";
				aRows.push("<div class=' row"+sClass+"'>"+sItem+"</div>");
			}
			return "<div class='flex_column hideMax' id='tUsers'>"+aRows.join("")+"</div>";
		}
		
		var sRegisters = getRegisters_inner(8,4);
		var sRegi_data = getRegisters_data_inner();
		var sMemory = getMemory_inner(8);
		var sMemory_data = getMemory_data_inner(10,8);		
		var sData_table = getData_inner(5,2);
		
		var sTopRow = "<div class='flex_row'>"+sRegisters+sRegi_data+"</div>";
		var sMidRow = "<div class='flex_row'>"+sMemory+sMemory_data+"</div>";
		var sBotRow = "<div class='flex_row'>"+sData_table+"</div>";
		var sUndRow = "<div class='flex_row'>"+get_sys_load()+get_users(4)+"</div>";
		
		var sNasm = sTopRow+sMidRow+sBotRow+sUndRow;
		
		oNasmTimer = setInterval(updateNasm, 300);
		
		return sNasm; 
	}
	
	function get_sim_load(){
		var nR = randd(1,100);
		var nPoints = 20;
		var nOnePoint = ~~(100/nPoints); // how much percents in one point
		var aLine = [];
		for(var i=0; i<nPoints; i++) {
			var sItem = (i*nOnePoint<nR)? "|": "&nbsp;";
			aLine.push(sItem);
		}
		var sStyle = "";
		if(nR>60) {
			sStyle = " style='color: yellow' ";
		}
		if(nR>90) {
			sStyle = " style='color: red' ";
		}
		if(nR<10) {
			nR="&nbsp;&nbsp;"+nR;
		} else if(nR<100) {
			nR="&nbsp;"+nR;
		}
		return "[<span"+sStyle+">"+aLine.join("")+"</span>] <span"+sStyle+">" +nR+"%</span>";
	}
	
	function sin(sParam){
		/*/
			     .-.
			    /   \         .-.
			   /     \       /   \       .-.     .-.     _   _
			--/-------\-----/-----\-----/---\---/---\---/-\-/-\/\/---
			 /         \   /       \   /     '-'     '-'
			/           '-'         '-'
		/**/
		var sRet="";
		var aSin = [
		"     .-.",
		"    /   \\         .-.",
		"   /     \\       /   \\       .-.     .-.     _   _",
		"  /       \\     /     \\     /   \\   /   \\   / \\ / \\/\\/---",
		" /         \\   /       \\   /     '-'     '-'",
		"/           '-'         '-'"
		];
		
		var sSin = aSin.join("<br>").replace(/\s/g, "&nbsp;");
		
		function replace_last(str, sim){
			return str.substring(0, str.length - 1)+sim;
		}
		
		function generate_sin(){
			var sRet = "";
			var aRet=[];
			var sStat = 0;
			var sDir = 1; // 1- up, -1 - down
			var nMaxStat = 4;
			for(var i=0; i<30; i++) {
				var sMod = (sStat<0)? -sStat: sStat;
				var sDif = nMaxStat - sMod;
				if (sDir>0) { // up
					// 0 - 0|4
					if(sStat<0 || randd(sDif)) {
						sStat++;
					} else {		
						//sRet = replace_last(sRet, "t");		
						aRet[aRet.length-1] = "t";
						sStat--;
						sDir *= -1;
					}					
				} else {    // down
					if(sStat>0 || randd(-sDif)) {
						sStat--;
					} else {
						//sRet = replace_last(sRet, "b");	
						aRet[aRet.length-1] = "b";
						sStat++;
						sDir *= -1;
					}
				}
				
				//sRet+=sStat;
				aRet.push(sStat);
			}
			if (aRet[0] == "t" || aRet[0] == "b") {
				aRet.shift();
			}
			//console.log(aRet.length);
			return aRet; //sRet.replace(/^t|b/,"");
		};
		
		function generate_line(sNums){
			var sRet= "";
			var aRet=[];
			var nMax = 4;
			var nDir = (sNums[1]>sNums[0] || sNums[1]=='t')? 1: -1;
			function empty_cells(n){
				var aCells = [];
				for(var i=0; i<n; i++) {
					aCells.push("<span class='cel'>&nbsp;</span>");
				}
				return aCells.join("");
			}
			for(var i=0; i<sNums.length; i++) {
				switch(sNums[i]) {
					case "t": 
						aRet.push("<div class='col'>"+empty_cells(3-sNums[i-1])+"<span class='cel'>.</span>"+empty_cells(3+sNums[i-1])+"</div>");
						aRet.push("<div class='col'>"+empty_cells(3-sNums[i-1])+"<span class='cel'>-</span>"+empty_cells(3+sNums[i-1])+"</div>");
						aRet.push("<div class='col'>"+empty_cells(3-sNums[i-1])+"<span class='cel'>.</span>"+empty_cells(3+sNums[i-1])+"</div>");
						nDir = -1;
						break;
					case "b": 
						aRet.push("<div class='col'>"+empty_cells(5-sNums[i-1])+"<span class='cel'>'</span>"+empty_cells(5+sNums[i-1])+"</div>");
						aRet.push("<div class='col'>"+empty_cells(5-sNums[i-1])+"<span class='cel'>-</span>"+empty_cells(5+sNums[i-1])+"</div>");
						aRet.push("<div class='col'>"+empty_cells(5-sNums[i-1])+"<span class='cel'>'</span>"+empty_cells(5+sNums[i-1])+"</div>");
						nDir = 1;
						break;
					default: 
						if(nDir>0) {
							aRet.push("<div class='col'>"+empty_cells(4-sNums[i])+"<span class='cel'>/</span>"+empty_cells(4+sNums[i])+"</div>");
						} else {							
							aRet.push("<div class='col'>"+empty_cells(4-sNums[i])+"<span class='cel'>\\</span>"+empty_cells(4+sNums[i])+"</div>");
						}
				}
			}
			sRet = "<div class='sin_cont'>"+aRet.join("")+"</div>";
			return sRet;
		}
		
		switch(sParam){
			case "columns": 
				sRet = generate_line(generate_sin())
				break;
			default: sRet = sSin;
		}
		return sRet;
		
	}
	/////////// /NASM
	function createConsole(oParams) {
		var sNasm = create_nasm();
		var oConsole = `<div class='overlay'>
				<div class='blink'>
				</div>
			</div>
			<div id='console' class='console noselect'>
      <div id='console_mainText'></div>
      <div id='console_asm'>`+sNasm+`</div>
    </div>
		<input type='text' class='consoleInput'>`;
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
				if(i<iMax+7){
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
				typeSymbol(sText, i, true, "red");
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