SetTitleMatchMode, 2

::bor::hlb\borsutzha
Return


;~F8::
;if (WinActive("Termeros")) {
;  Send ^{E}
;  msgbox, "termeros"
;  return
;} Else {
;	KeyWait, F8
;	msgbox, "normal"
;	return
;}
;Return

;~F7::
;WinGetTitle, Title, A
;MsgBox, The active window is "%Title%".
;  Send ^{e}
;  return


^k::
	WinActivate, PL/SQL
Return
^#::
    WinActivate, Eclipse
Return
^+#::
 	Process, Exist, vivaldi.exe
 	vivaldiPID=%Errorlevel%
 	WinActivate ahk_pid %vivaldiPID%
Return


;k::
;if A_PriorHotkey <> k
;{
;
;   KeyWait, k  
;   return
;}
;if A_TimeSincePriorHotkey > 500
;{
;   KeyWait, k 
;   MsgBox "case2"
;   return
;}
;;goes bellow this point only if Joy1 was pressed 2 times within 0.5sec
;MsgBox "case3"
;Send {Esc}
;return


;~j::
;if (A_PriorHotkey <> "~j" or A_TimeSincePriorHotkey > 400)
;{
;    ; Too much time between presses, so this isn't a double-press.
;    KeyWait, j
;    return
;}
;; Double-press
;Send {Backspace}
;Send {Backspace} 
;Send {Esc}
;return