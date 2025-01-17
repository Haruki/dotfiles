#!/bin/sh

# Prerequisites: basic-install executed.
# pacstrap install complete

# chroot:
# further system config:


echo riker > /etc/hostname

echo LANG=de_DE.UTF-8 > /etc/locale.conf


#/etc/locale.gen wurde im vorherigen script angelegt
locale-gen

echo KEYMAP=de-latin1-nodeadkeys > /etc/vconsole.conf
echo FONT=lat9w-16 >> /etc/vconsole.conf

# timezone

ln -sf /usr/share/zoneinfo/Europe/Berlin /etc/localtime

echo "127.0.0.1	 	localhost.localdomain		localhost" >> /etc/hosts
echo "::1		localhost.localdomain		localhost" >> /etc/hosts



#modified: 
#1. actually write to pacman.conf
#2. also uncomment multilib header
sudo sed -i '/#\[multilib\]/{s/#//;n;s/#Include/Include/}' /etc/pacman.conf && sudo sed -i '/\[multilib\]/a SigLevel = PackageRequired TrustedOnly' /etc/pacman.conf


# update packagelist
pacman -Sy

# initramfs
mkinitcpio -p linux

# root password
passwd


# bootloader GRUB

pacman -S grub efibootmgr grub-btrfs

# BIOS
# grub-install /dev/sda

#EFI
#grub-install --target=x86_64-efi --efi-directory=/boot --bootloader-id=grub
# ACHTUNG: Bootpartition separat auf /efi und /boot ist im root subvolume enthalten!
grub-install --target=x86_64-efi --efi-directory=/efi --boot-directory=/boot --bootloader-id=grub
#BIOS MBR
#grub-install /dev/sda


grub-mkconfig -o /boot/grub/grub.cfg

#network config

cp /etc/netctl/examples/ethernet-dhcp /etc/netctl
#in der Vorlage eht0 aendern in korrekten interace name
sed -i 's/eth0/'$(ip link | grep 2: | awk '{print substr($2, 1, length($2)-1)}')'/' /etc/netctl/ethernet-dhcp

netctl enable ethernet-dhcp



echo "now reboot into new installation"
exit

