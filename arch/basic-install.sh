#!/bin/sh

# Prerequisites: see readme.txt (loadkeys + partitioning completed)

# Expected standard partitioning:
# boot: /dev/sda1 (EFI)
# swap: /dev/sda2
# linux: /dev/sda3

# create filesystems:
# EFI:
#mkfs.fat -F 32 -n EFIBOOT /dev/sda1

# swap and linux:
#mkfs.ext4 -L arch /dev/sda3
#mkswap -L swap /dev/sda2


#mount (linux + swap + boot)

#mount -L arch /mnt
#mkdir -p /mnt/boot
#mount -L EFIBOOT /mnt/boot
#swapon -L swap





# ------------------------ BASIC SYSTEM ---------------------------

# pacman mirrorlist config:
cp /etc/pacman.d/mirrorlist /etc/pacman.d/mirrorlist.bak
grep -E -A 1 ".*Germany.*$" /etc/pacman.d/mirrorlist.bak  | sed '/--/d' > /etc/pacman.d/mirrorlist

# pacman basic packages
pacstrap /mnt base base-devel linux bash-completion dhcp dhcpcd dhclient

# intel:
#pacstrap /mnt intel-ucode

# basic work stuff
pacstrap /mnt vim neovim git
# efi  stuff
pacstrap /mnt dosfstools 

# wlan
pacstrap /mnt wpa_supplicant netctl dialog




# fstab
genfstab -p /mnt/ > /mnt/etc/fstab


#Locale copy. needed by next script to generate locales in arch_chroot
cat /etc/locale.gen | sed 's/#de_DE/de_DE/' | sed 's/#en_US/en_US/' > /mnt/etc/locale.gen 


echo 'DOTO: fstab relatime -> noatime + discard'

