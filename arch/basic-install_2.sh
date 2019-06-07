#!/bin/sh

# Prerequisites: basic-install executed.
# pacstrap install complete

# chroot:
# further system config:

cp chroot-install.sh /mnt/chroot-install.sh
arch-chroot /mnt /chroot-install.sh

