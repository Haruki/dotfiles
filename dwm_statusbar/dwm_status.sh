#!/bin/sh

CLOCK=$(echo -e "\uf017")
while true
do

	xsetroot -name "$CLOCK $(date +'%a %d %b %H:%M')"
	sleep 5
done

