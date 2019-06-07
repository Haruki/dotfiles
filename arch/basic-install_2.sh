#!/bin/sh

# Prerequisites: basic-install executed.
# pacstrap install complete

# chroot:
# further system config:

arch-chroot /mnt

echo archvm > /etc/hostname

echo LANG=de_DE.UTF-8 > /etc/locale.conf


cat /etc/locale.gen | sed 's/#de_DE/de_DE/' | sed 's/#en_US.ISO/en_US.ISO/' > /etc/locale.gen 
