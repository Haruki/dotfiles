#!/bin/sh

#prerequisits
#both basic installers have been executed

pacman -Sy
pacman -S xorg-server xorg-xinit libxkbcommon libxkbcommon-x11
# libxkbcommon wegen fehler bei localctl

#Treiber
# lspci | grep VGA

#most generic:
#pacman -S xf86-video-vesa

#german keyboard layout for X
localectl set-x11-keymap de pc105 nodeadkeys

#fonts
pacman -S ttf-dejavu

#next step window manager / desktop environment

