#!/bin/zsh

RESULT=""
while IFS= read -r displayLine
do
	FIRST="$(echo $displayLine | grep -Po '^\w*')"
	RESULT="${RESULT}$FIRST"
	echo ${RESULT}
	echo ${displayLine}
done < <(xrandr | grep -P "^\w.*" | grep -v "^[Screen]")
