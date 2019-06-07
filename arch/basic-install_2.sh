#!/bin/sh

# Prerequisites: basic-install executed.
# pacstrap install complete

# chroot:
# further system config:

arch-chroot /mnt

echo archvm > /etc/hostname

echo LANG=de_DE.UTF-8 > /etc/locale.conf


