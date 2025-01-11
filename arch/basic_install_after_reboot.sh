#!/bin/sh

#new standard user:
useradd -m -g users -s /bin/bash riker
#password
passwd riker

#sudo
pacman -Sy
pacman -S sudo

#uncomment %wheel entry
sed -i 's/# %wheel ALL=(ALL:ALL) ALL$/%wheel ALL=(ALL:ALL) ALL/'   /etc/sudoers 

#user zur gruppe wheel hinzufügen:
gpasswd -a riker wheel

#weitere dienste:
pacman -S acpid dbus avahi cups cronie

systemctl enable acpid
systemctl enable avahi-daemon
systemctl enable org.cups.cupsd.service
systemctl enable cronie
systemctl enable --now systemd-timesyncd.service

#manuals
pacman -S man-db man-pages
mandb

#ggf. hardware clock set
#hwclock -w

echo 'Next: x install'


