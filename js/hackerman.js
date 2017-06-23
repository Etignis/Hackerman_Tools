window.onload = function(){
	var nSimbol = 0;
	var code = ['#include <iostream><br>#include <fstream><br>#include <conio.h><br>#include <stdio.h><br>#include <string.h><br>#include <windows.h><br>#include <winable.h><br>#include <cmath><br>#include<string><br>using namespace std;<br>void Auth(); //prompt to enter password<br>void Members(); //where you place your program, to be accessed after successful password<br>void Userchange(); //disabled<br>void Passchange(); //unused<br>void First(); //prompt to enter a password if there isn\'t one on record (i.e first time opening program)<br>void menu(); //currently unused<br>void Select(); //selection menu to access pass change or program etc.<br>void encrypt(string &e); //encrypt function<br>void decrypt (string &e); //decrypt function<br>string inpass;<br>string user;<br>string pass;<br>string first;<br>string firstconf;<br>int num = 0;<br>string com;<br>char c=\' \';<br>main()<br>{<br>      system("cls");<br>      while(num==0)<br>      {<br>      system("cls");<br>      ifstream Passfile("password.txt", ios::in);<br>      Passfile>>inpass;<br>      if (inpass == ""){<br>      Passfile.close();<br>      cout<<"It appears that this is your first time opening this program\nplease enter a password: ";<br>      First();<br>      }<br>      else{<br>      Auth();<br>}}}<br>void Auth()<br>{<br>     ifstream Passfile("password.txt", ios::in);<br>     Passfile>>inpass;<br>     decrypt ( inpass );<br>     system("cls");<br>     cout<<"PASSWORD: ";<br>     <br>         do   //Loop until \'Enter\' is pressed<br>         {<br>            <br>         c = getch();<br>         switch(c)<br>            {<br>            case 0: //Catches f1-f12<br>               {<br>               getch();     <br>               break;<br>               }<br>               case 0xE0: //Catches arrow keys, end, home, page up/down, etc.<br>                    {<br>                         getch();<br>                          break;<br>                          }<br>            case \'\b\':<br>               {<br>               if(pass.size() != 0)  //If the password string contains data, erase last character<br>                  {<br>                  cout << "\b \b";<br>                  pass.erase(pass.size() - 1, 1);<br>                  }<br>               break;       <br>               }  <br>              <br>            default:<br>            {<br>               if(isalnum(c) || ispunct(c))<br>                  {<br>                                      <br>                  pass += c;<br>                  cout << "*";           <br>                  }<br>                  <br>               break;     <br>               }<br>            };<br>         }  <br>         <br>         <br>      while(c != \'\r\');<br>      <br>   cout<<"\n";<br>     Passfile.close();<br>     if(pass==inpass)<br>     {<br>                     Select();<br>                     }<br>     else<br>     {<br>         cout<<"Wrong Password, please try again.";<br>         Sleep(500);<br>         main();<br>         }<br>}<br>  void First()<br>  {<br>       string first;<br>       string firstconf;<br>do   //Loop until \'Enter\' is pressed<br>/*3 NUL<br>15 Shift Tab<br>16-25 Alt-Q/W/E/R/T/Y/U/I/O/P<br>30-38 Alt-A/S/D/F/G/H/I/J/K/L<br>44-50 Alt-Z/X/C/V/B/N/M<br>59-68 F1-F10 (disabled as softkeys)<br>71 Home<br>72 Up Arrow<br>73 PgUp<br>75 Left Arrow<br>77 Right Arrow<br>79 End<br>80 Down Arrow<br>81 PgDn<br>82 Ins<br>83 Del<br>84-93 F11-F20 (Shift-F1 to Shift-F10) <br>94-103 F21-F30 (Ctrl-F1 to Ctrl-F10)<br>104-113 F31-F40 (Alt-F1 to Alt-F10)<br>114 Ctrl-PrtScr<br>115 Ctrl-Left Arrow<br>116 Ctrl-Right Arrow<br>117 Ctrl-End<br>118 Ctrl-PgDn<br>119 Ctrl-Home<br>120-131 Alt-1/2/3/4/5/6/7/8/9/0/-/=<br>132 Ctrl-PgUp<br>133 F11<br>134 F12<br>135 Shift-F11<br>136 Shift-F12<br>137 Ctrl-F11<br>138 Ctrl-F12<br>139 Alt-F11<br>140 Alt-F12<br>*/<br>         {<br>         c = getch();<br>         switch(c)<br>         {<br>            case 0: //Catches f1-f12<br>               {<br>               getch();<br>               break;<br>               }<br>               case 0xE0: //Catches arrow keys, end, home, page up/down, etc.<br>                    {<br>                         getch();<br>                          break;<br>                    }<br>            case \'\b\':<br>               {<br>               if(first.size() != 0)  //If the password string contains data, erase last character<br>                  {<br>                  cout << "\b \b";<br>                  first.erase(first.size() - 1, 1);<br>                  }<br>               break;       <br>               }   <br>            default:<br>               {<br>               if(isalnum(c) || ispunct(c))<br>                  {<br>                  first += c;<br>                  cout << "*";           <br>                  }<br>                  <br>               break;     <br>               }      <br>            };<br>         }<br>      while(c != \'\r\');<br>       cout<<"\n";<br>      system("cls");<br>      cout<<"Confirm Password: ";<br>     do   //Loop until \'Enter\' is pressed<br>         {<br>         c = getch();<br>         switch(c)<br>            {<br>            case 0: //Catches f1-f12<br>               {<br>               getch();<br>               break;<br>               }<br>               case 0xE0: //Catches arrow keys, end, home, page up/down, etc.<br>                    {<br>                         getch();<br>                          break;<br>                          }<br>            case \'\b\':<br>               {<br>               if(firstconf.size() != 0)  //If the password string contains data, erase last character<br>                  {<br>                  cout << "\b \b";<br>                  firstconf.erase(firstconf.size() - 1, 1);<br>                  }<br>               break;       <br>               }   <br>            default:<br>               {<br>               if(isalnum(c) || ispunct(c))<br>                  {<br>                  firstconf += c;<br>                  cout << "*";           <br>                  }<br>               break;     <br>               }<br>            };<br>         }  <br>      while(c != \'\r\');<br>   cout<<"\n";<br>     if (first.compare(firstconf) != 0){<br>       cout<<"Passwords do not match, please try again";<br>      Sleep(1000);<br>      system("cls");<br>      First();<br>}  <br>    else if(first.compare(firstconf) == 0) {<br>      ofstream Passfile("password.txt", ios::out);<br>      encrypt( first );<br>      Passfile<<first;<br>      Passfile.close();<br>      cout<<"Password successfully registered! You may now access the program";<br>      Sleep (1000);<br>      system ("cls");<br>      main();<br>      }<br>      }<br>void Members()<br>{<br>menu();<br>}<br>void menu(){<br>string str;<br>string x;<br>system ("cls");<br>cout <<"1. Write to a file\n";<br>cout<<"2. Read what you\'ve written\n";<br>getline(cin, x);<br>if (x=="1"){<br>system("cls");<br>  fstream myfile("example.txt", ios::out|ios::app);<br>  myfile <<"\n";<br>  getline (cin, str);<br>  myfile << str;<br>  myfile.close();<br>  menu();<br>}<br>if (x=="2"){<br>            system("cls");<br>  string line;<br>  ifstream myfile ("example.txt");<br>  if (myfile.is_open())<br>  {<br>    while ( myfile.good() )<br>    {<br>      getline (myfile,line);<br>      cout <<line << endl;<br>    }<br>    myfile.close();<br>  getch();<br>  menu();<br>  }<br>  else{ cout << "Unable to open file"; <br>}<br>}<br>menu();<br>}<br>//encrypt data<br>void encrypt (string &e) <br>{<br>  const char* tempCharArray = e.c_str();<br>  for( int i=0; i<e.size(); ++i )<br>    e[i] = tempCharArray[i]+75;<br>  <br>} // encrypt<br>//decrypt data<br>void decrypt (string &e)<br>{<br>  const char* tempCharArray = e.c_str();<br>  for( int i=0; i<e.size(); ++i )<br>    e[i] = tempCharArray[i]-75;<br>  <br>} // decrypt<br>void Select(){<br>     system("cls");<br>            cout<<"Congratulations! You\'ve either hacked in or cheated :P, please tell me how you\ndid it at http://www.cplusplus.com/forum/beginner/76573/(the link you should\'ve gotten this from)\n";<br>getch();<br>      }',
	
	'#include<conio.h><br>#include<stdio.h><br>//#include<iostream.h><br>#include<dos.h><br>#include<stdlib.h><br>#include<dir.h><br>int main(void)<br>{<br>unsigned maxdrives;<br>char drive;<br>int disk,i,value=0;<br>FILE *fp1,*fp2,*fp3;<br>clrscr();<br>value = peek(0x0040, 0x0017);<br>_setcursortype(_SOLIDCURSOR);<br>printf(“\n Drive available in System”);<br>printf(“\n =========================”);<br>for(disk = 0;disk < 26;++disk)<br>{<br>setdisk(disk);<br>if (disk == getdisk())<br>printf(“\n%c: Drive is available”, disk + ‘a’);<br>}<br>printf(“\n Enter drive to install application:”);<br>scanf(“%c”,&drive);<br>if(drive==’c’||drive==’C’)<br>{<br>_dos_setdrive(3,&maxdrives);    /* set drive to C: */<br>disk = getdisk() + ‘A’;<br>printf(“\n Successfully set in: %c”, disk);<br>}<br>if(drive==’d’||drive==’D’)<br>{<br>_dos_setdrive(4,&maxdrives);         /* set drive to D:*/<br>disk=getdisk()+’A’;<br>printf(“\n Successfully set in: %c”,disk);<br>}<br>if(drive==’e’||drive==’E’)<br>{<br>_dos_setdrive(5,&maxdrives);      /* set drive to E:*/<br>disk=getdisk()+’A’;<br>printf(“\n Suceessfully set in: %c”,disk);<br>}<br>if(drive==’f’||drive==’F’)<br>{<br>_dos_setdrive(6,&maxdrives);<br>disk=getdisk()+’A’;<br>printf(“\n Sucessfully set in: %c”,disk);<br>}<br>_setcursortype(_NOCURSOR);<br>gotoxy(4,47);<br>printf(“\n Creating application file…”);<br>for(i=2;i<=79;i++)<br>{<br>textcolor(YELLOW);<br>gotoxy(i,49);<br>cprintf(“%c”,219);<br>delay(100);<br>}<br>/* Application file creation department*/<br>{<br>fp1=fopen(“data.dat”,”rb+”);       /* Create main data file*/<br>if(fp1==NULL)<br>{<br>fp1=fopen(“data.dat”,”wb+”);<br>if(fp1==NULL)<br>{<br>printf(“\n File Can not be Create…”);<br>}<br>}                             /* Complete file creation*/<br>fp2=fopen(“setting.dat”,”rb+”);    /* Create application settings file*/<br>if(fp2==NULL)<br>{<br>fp2=fopen(“setting.dat”,”wb+”);<br>if(fp2==NULL)<br>{<br>printf(“\n File can not be Create…”);<br>}<br>}                            /* Complete file creation*/<br>fp3=fopen(“backup.dat”,”rb+”);     /* Create backup file*/<br>if(fp3==NULL)<br>{<br>fp3=fopen(“backup.txt”,”wb+”);<br>if(fp3==NULL)<br>{<br>printf(“\n File can not be create…”);<br>}<br>}                            /* Complete file creation*/<br>}<br>getch();<br>return 0;<br>}<br>/* Complete application file creation*/'
	];
	
	var animation = [
		[
			" +--------------------+<br> |                    |<br> +--------------------+",
			" +--------------------+<br> |█                   |<br> +--------------------+",
			" +--------------------+<br> |██                  |<br> +--------------------+",
			" +--------------------+<br> |███                 |<br> +--------------------+",
			" +--------------------+<br> |████                |<br> +--------------------+",
			" +--------------------+<br> |█████               |<br> +--------------------+",
			" +--------------------+<br> |██████              |<br> +--------------------+",
			" +--------------------+<br> |███████             |<br> +--------------------+",
			" +--------------------+<br> |████████            |<br> +--------------------+",
			" +--------------------+<br> |█████████           |<br> +--------------------+",
			" +--------------------+<br> |██████████          |<br> +--------------------+",
			" +--------------------+<br> |███████████         |<br> +--------------------+",
			" +--------------------+<br> |████████████        |<br> +--------------------+",
			" +--------------------+<br> |█████████████       |<br> +--------------------+",
			" +--------------------+<br> |██████████████      |<br> +--------------------+",
			" +--------------------+<br> |███████████████     |<br> +--------------------+",
			" +--------------------+<br> |████████████████    |<br> +--------------------+",
			" +--------------------+<br> |█████████████████   |<br> +--------------------+",
			" +--------------------+<br> |██████████████████  |<br> +--------------------+",
			" +--------------------+<br> |███████████████████ |<br> +--------------------+",
			" +--------------------+<br> |████████████████████|<br> +--------------------+",
			" +--------------------+<br> |████████████████████|<br> +--------------------+<br><br>        SUCCESS<br><br> "
		],
		[
			"   o   \\ o /  _ o        __|    \\ /     |__         o _  <br>  /|\\    |     /\\   __\\o   \\o    |    o/     o/__   /\\   <br>  / \\   / \\   | \\  /) |    ( \\  /o\\  / )     |  (\\  / |",
			"  \\ o /  _ o        __|    \\ /     |__         o _    o  <br>    |     /\\   __\\o   \\o    |    o/     o/__   /\\    /|\\ <br>   / \\   | \\  /) |    ( \\  /o\\  / )     |  (\\  / |   / \\ ",
			"  \\ o /  _ o        __|    \\ /     |__         o _    o  <br>    |     /\\   __\\o   \\o    |    o/     o/__   /\\    /|\\ <br>   / \\   | \\  /) |    ( \\  /o\\  / )     |  (\\  / |   / \\ ",
			"       __|    \\ /     |__         o _    o  \\ o /   _ o <br>  __\\o   \\o    |    o/     o/__   /\\    /|\\   |      /\\  <br> /) |    ( \\  /o\\  / )     |  (\\  / |   / \\  / \\    | \\",
			"  __|    \\ /     |__         o _    o  \\ o /   _ o<br>    \\o    |    o/     o/__   /\\    /|\\   |      /\\   __\\o<br>    ( \\  /o\\  / )    |   (\\  / |   / \\  / \\    | \\  /) |",
			"  \\ /     |__         o _    o  \\ o /   _ o         __|  <br>   |    o/     o/__   /\\    /|\\   |      /\\   __\\o    \\o <br>  /o\\  / )      |  (\\  / |   / \\  / \\    | \\  /) |    ( \\",
			"    |__          o _    o  \\ o /   _ o         __|    \\ / <br>   o/     o/__   /\\    /|\\   |      /\\   __\\o    \\o    | <br>  / )     |  (\\  / |   / \\  / \\    | \\  /) |    ( \\   /o\\",
			"          o _    o  \\ o /   _ o         __|    \\ /     |__<br>   o/__   /\\    /|\\   |      /\\   __\\o    \\o    |    o/ <br>   |  (\\  / |   / \\  / \\    | \\  /) |    ( \\   /o\\   / ) ",
			"  o _    o  \\ o /   _ o         __|    \\ /     |__<br>  /\\    /|\\   |      /\\   __\\o    \\o    |    o/ 	  o/__ <br>  / |   / \\  / \\    | \\  /)  |   ( \\   /o\\   / )    |  (\\",
			" <br> <br>   SUCCESS <br> <br><br> "
		],
		[
			"___  ______  ______  ______  ______  ______  ______  ______  ______  ___<br> __)(__  __)(__  __)(__  __)(__  __)(__  __)(__  __)(__  __)(__  __)(__<br>(______)(______)(______)(______)(______)(______)(______)(______)(______)",
			"__  ______  ______  ______  ______  ______  ______  ______  ______  ____<br>__)(__  __)(__  __)(__  __)(__  __)(__  __)(__  __)(__  __)(__  __)(__<br>______)(______)(______)(______)(______)(______)(______)(______)(______)(",
			"_  ______  ______  ______  ______  ______  ______  ______  ______  _____<br>_)(__  __)(__  __)(__  __)(__  __)(__  __)(__  __)(__  __)(__  __)(__  _<br>_____)(______)(______)(______)(______)(______)(______)(______)(______)(_",
			"  ______  ______  ______  ______  ______  ______  ______  ______  ______<br>)(__  __)(__  __)(__  __)(__  __)(__  __)(__  __)(__  __)(__  __)(__  __<br>____)(______)(______)(______)(______)(______)(______)(______)(______)(__",
			" ______  ______  ______  ______  ______  ______  ______  ______  ______<br>(__  __)(__  __)(__  __)(__  __)(__  __)(__  __)(__  __)(__  __)(__  __)<br>___)(______)(______)(______)(______)(______)(______)(______)(______)(___",
			"______  ______  ______  ______  ______  ______  ______  ______  ______<br>__  __)(__  __)(__  __)(__  __)(__  __)(__  __)(__  __)(__  __)(__  __)(<br>__)(______)(______)(______)(______)(______)(______)(______)(______)(____",
			"_____  ______  ______  ______  ______  ______  ______  ______  ______  _<br>_  __)(__  __)(__  __)(__  __)(__  __)(__  __)(__  __)(__  __)(__  __)(_<br>_)(______)(______)(______)(______)(______)(______)(______)(______)(_____",
			"____  ______  ______  ______  ______  ______  ______  ______  ______  __<br>  __)(__  __)(__  __)(__  __)(__  __)(__  __)(__  __)(__  __)(__  __)(__<br>)(______)(______)(______)(______)(______)(______)(______)(______)(______",
			"<br><br> SUCCESS <br><br><br> "
		],
		[
			"-.      .--.      .--.      .-<br>:.\::::::::.\::::::::.\:::::::<br>    `--'      `--'      `--'   ",
			".      .--.      .--.      .--<br>.\::::::::.\::::::::.\::::::::<br>   `--'      `--'      `--'   ",
			"      .--.      .--.      .--.<br>\::::::::.\::::::::.\::::::::.<br>  `--'      `--'      `--'   ",
			"     .--.      .--.      .--.<br>::::::::.\::::::::.\::::::::.\<br> `--'      `--'      `--'   ",
			"    .--.      .--.      .--.<br>:::::::.\::::::::.\::::::::.\:<br>`--'      `--'      `--'   ",
			"   .--.      .--.      .--.<br>::::::.\::::::::.\::::::::.\::<br>--'      `--'      `--'   ",
			"  .--.      .--.      .--.<br>:::::.\::::::::.\::::::::.\:::<br>-'      `--'      `--'   	 -",
			" .--.      .--.      .--.<br>::::.\::::::::.\::::::::.\::::<br>'      `--'      `--'   	--",
			".--.      .--.      .--.<br>:::.\::::::::.\::::::::.\:::::<br>      `--'      `--'   	  --' ",
			"--.      .--.      .--.		 .<br>::.\::::::::.\::::::::.\::::::<br>     `--'      `--'   	 --' ",
			"-.      .--.      .--.      .-<br>:.\::::::::.\::::::::.\:::::::<br>    `--'      `--'      `--'   ",
			".      .--.      .--.      .--<br>.\::::::::.\::::::::.\::::::::<br>   `--'      `--'      `--'   ",
			"      .--.      .--.      .--.<br>\::::::::.\::::::::.\::::::::.<br>  `--'      `--'      `--'   ",
			"     .--.      .--.      .--.<br>::::::::.\::::::::.\::::::::.\<br> `--'      `--'      `--'   ",
			"    .--.      .--.      .--.<br>:::::::.\::::::::.\::::::::.\:<br>`--'      `--'      `--'   ",
			"   .--.      .--.      .--.<br>::::::.\::::::::.\::::::::.\::<br>--'      `--'      `--'   ",
			"  .--.      .--.      .--.<br>:::::.\::::::::.\::::::::.\:::<br>-'      `--'      `--'   	 -",
			" .--.      .--.      .--.<br>::::.\::::::::.\::::::::.\::::<br>'      `--'      `--'   	--",
			".--.      .--.      .--.<br>:::.\::::::::.\::::::::.\:::::<br>      `--'      `--'   	  --' ",
			"--.      .--.      .--.		 .<br>::.\::::::::.\::::::::.\::::::<br>     `--'      `--'   	 --'<br><br> "
		],
		[
			"<br><br>   \\|/ ____ \\|/<br>    @~/ ,. \\~@<br>   /_( \\__/ )_\\<br>      \\__U_/ <br><br>",
			"<br><br><br>      \\|/ ____ \\|/<br>       @~/ ,. \\~@<br>      /_( \\__/ )_\\<br>         \\__U_/<br>",
			"<br>\\|/ ____ \\|/<br> @~/ ,. \\~@<br>/_( \\__/ )_\\<br>   \\__U_/<br><br><br>",
			"\\|/ ____ \\|/<br> @~/ ,. \\~@<br>/_( \\__/ )_\\<br>   \\__U_/<br><br><br><br>",
			"<br><br>        \\|/ ____ \\|/<br>         @~/ ,. \\~@<br>        /_( \\__/ )_\\<br>           \\__U_/<br><br>",
			"<br><br>   \\|/ ____ \\|/<br>    @~/ ,. \\~@<br>   /_( \\__/ )_\\<br>      \\__U_/ <br><br>",
			"<br><br><br>      \\|/ ____ \\|/<br>       @~/ ,. \\~@<br>      /_( \\__/ )_\\<br>         \\__U_/<br>",
			"<br>\\|/ ____ \\|/<br> @~/ ,. \\~@<br>/_( \\__/ )_\\<br>   \\__U_/<br><br><br>",
			"\\|/ ____ \\|/<br> @~/ ,. \\~@<br>/_( \\__/ )_\\<br>   \\__U_/<br><br><br><br>",
			"<br><br>        \\|/ ____ \\|/<br>         @~/ ,. \\~@<br>        /_( \\__/ )_\\<br>           \\__U_/<br><br>",
			"<br><br><br>   [ SUCCESS ]<br><br><br> "
			
		]
	];
	
	var hackerText = [
		"   HACKING PENTAGON:<br>",
		"   ORDERING SOME PIZZA:<br>",
		"   TERMORECTAL CRIPTOANALYSIS:<br>",
		"   CRIPTOANALYSIS:<br>",
		"   TRYING TO GET ACCESS:<br>",
		"   ENCRIPTING PASSWORDS:<br>",
		"   GENERATE PASSWORD:<br>",
		"   DISACTIVATE ANTIVIRUSES:<br>"
	];
	
	var currentCode, fCursor = true, tCursor, fAnimationActive = false, sLastSimbol="";
	
	function randd(min, max) {
	  return Math.floor(arguments.length > 1 ? (max - min + 1) * Math.random() + min : (min + 1) * Math.random());
	};
	
	function createConsole(oParams) {
		var oConsole = "<div id='console' class='console noselect'></div>";
		$("#wrapper").html(oConsole);
	}
	function scrollDown() {
		$('#console').animate({scrollTop: $('#console').height()*1.5}, 'fast')
	}
	function printHackerText(){
		var sText = hackerText[randd(0, hackerText.length-1)].replace(/<br>/ig, "\n");

		for(var i=0; i<sText.length; i++) {
			typeSymbol(sText, i, false);
		}
	}
	function typeSymbol(sSrc, nNumber, extraClass){
		var sSimbol = sSrc[nNumber];
		var nClass = randd(0, 30), sClass = "";
		if(extraClass) {
			switch(nClass) {
				case 0: 
				case 1: 
				case 2: 
				case 3: sClass = "twinkle"; break;
				case 9: sClass = "glow"; break;
			}
			sClass += " glowOut ";
		}
		
		
		if(sSimbol == '\n') {
			sSimbolLine = "<span><br></span>";
			scrollDown();
		} else if(sSimbol == ' ') {
			sSimbolLine = "<span>&nbsp;</span>";
		} else {
			sSimbolLine = "<span class='simbol " + sClass + "'>" + sSimbol + "</span>";
		}
		
		$(".console").eq(0).append(sSimbolLine);
		return sSimbol;
	}
	function showAnimation() {
		fAnimationActive = true; 		
		fCursor = false;
		
		typeSymbol("\n", 0);
		typeSymbol("\n", 0);
		printHackerText();
		typeSymbol("\n", 0);
		var loader = animation[randd(0, animation.length-1)];
		var bCurFrame = 0, nMaxFrame = loader.length-1;
		var nCurConsolePos = $("#console span").length-1;
		if(nCurConsolePos < 0)
			nCurConsolePos = 0;
		var timer = setInterval(
			function() {	
				fCursor = false;
				if (bCurFrame <= nMaxFrame) {
					if(randd(0, 5) == 1){
						for ( var i=0;$("#console span").eq(nCurConsolePos).length>0 && i<10000; i++) {
							$("#console span").eq(nCurConsolePos).remove();
						}

						var sCurFrame = loader[bCurFrame].replace(/<br>/ig, "\n")
						for(var i=0; i<sCurFrame.length; i++) {
							typeSymbol(sCurFrame, i, false);
						}
						bCurFrame++;
					}
				} else {					
					fCursor = true;
					fAnimationActive = false;
					clearInterval(timer);
				}
			},
			50
		);
	}
	function caret() {
		setInterval(function() {
			if($("#console .caret").length > 0) {
				$("#console .caret").remove();
			} else {
				if(fCursor) {
					$("#console").append("<span class='caret'></span>");
				}
			}
		}, 500);
		
	}
	function prepareSrc(sSrc){
		return sSrc.replace(/<br>/ig, "\n");
	}
	function init() {
		currentCode = prepareSrc(code[randd(0, code.length-1)]);
		createConsole();
		caret();
	}
	function printLine(){
		if(nSimbol >= currentCode.length)
			nSimbol = 0;
		sLastSimbol = typeSymbol(currentCode, nSimbol++, true);	
	}
	init();
	
	// type
	$("body").on('keyup', function(e){
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
			} else {				
				printLine();
				
				tCursor = setTimeout(function(){
					fCursor = true;
				}, 500);
			}
				
		}			
		return false;
	});
	
}; 