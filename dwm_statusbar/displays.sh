#!/bin/zsh

LAPTOP_ON="$(echo -e '\uf821')"
LAPTOP_OFF="$(echo -e '\ufbe5')"
EXT_ON="$(echo -e '\uf26c')"
EXT_OFF="$(echo -e '\ufd39')"

echo $LAPTOP_ON $LAPTOP_OFF $EXT_ON $EXT_OFF

RESULT=""
while IFS= read -r displayLine
do
	FIRST="$(echo $displayLine | grep -Po '^\w*')"
	RESULT="${RESULT}$FIRST"
	echo ${RESULT}
	echo ${displayLine}
done < <(xrandr | grep -P "^\w.*" | grep -v "^[Screen]")
