#!/bin/sh

# Prerequisites: basic-install executed.
# pacstrap install complete

# chroot:
# further system config:


echo archvm > /etc/hostname

echo LANG=de_DE.UTF-8 > /etc/locale.conf


cat /etc/locale.gen | sed 's/#de_DE/de_DE/' | sed 's/#en_US/en_US/' > /etc/locale.gen 

locale-gen

echo KEYMAP=de-latin1-nodeadkeys > /etc/vconsole.conf
echo FONT=lat9w-16 >> /etc/vconsole.conf

# timezone

ln -sf /usr/share/zoneinfo/Europe/Berlin /etc/localtime

echo "127.0.0.1	 	localhost.localdomain		localhost" >> /etc/hosts
echo "::1		localhost.localdomain		localhost" >> /etc/hosts




