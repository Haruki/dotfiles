#!/bin/zsh
ls /mnt/i/Angebot/2019/**/*Leistungsbeschreibung*.docx | fzf | sed 's_/mnt/i_I:_' | tr -d '\n' | xargs /mnt/c/Program\ Files/Microsoft\ Office\ 15/root/office15/winWORD.exe
