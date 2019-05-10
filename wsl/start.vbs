Set shell = CreateObject("WScript.Shell" ) 
shell.Run """C:\Program Files\VcXsrv\vcxsrv.exe"" :0 -screen 0 @1 -nodecoration -wgl"	
shell.Run "c:\data\ArchWSL\Arch.exe run ""~/.skripts/wlaunch""", 0
