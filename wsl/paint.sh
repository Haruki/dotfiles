#!/bin/sh
mspaint.exe `echo $1 | sed 's_\(\/mnt\/\)\([a-z]\)_\2:_'`

