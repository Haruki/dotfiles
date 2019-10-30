#!/bin/zsh
# Startet den Pulse-Audio Service, falls nicht bereits geschehen

RUNNING=$(ps -A | grep 'pulse' | wc -l)
if [ "$RUNNING" = "0" ]
then
	echo "starting pulseaudio"
	pulseaudio --start
else
	echo "pulseaudio already running"
fi

