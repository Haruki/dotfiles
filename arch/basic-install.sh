#!/bin/sh

# Prerequisites: see readme.txt (loadkeys + partitioning completed)

# Expected standard partitioning:
# boot: /dev/sda1 (EFI)
# swap: /dev/sda2
# linux: /dev/sda3

# create filesystems:
# EFI:
mkfs.fat -F 32 -n EFIBOOT /dev/sda1

# swap and linux:
#mkfs.ext4 -L arch /dev/sda3

#---------------------BTRFS---------
#btrfs: 
mkfs.btrfs -L arch /dev/nvme0n1p3
#mount for creating subvolumes:
mount /dev/nvme0n1p3 /mnt
cd /mnt
btrfs subvolume create @
btrfs subvolume create @home
#unmount mnt
cd
#unmount for mounting the new subvolumes instead
umount /mnt

mount -o noatime,ssd,compress=zstd,space_cache=v2,discard=async,subvol=@ /dev/nvme0n1p3 /mnt
#create home folder:
mkdir /mnt/home
#mount home subvolume to new home folder:
mount -o noatime,ssd,compress=zstd,space_cache=v2,discard=async,subvol=@home /dev/nvme0n1p3 /mnt/home
#show new subvolumes:
btrfs subvolume list /mnt

#ACHUTNG: manuell noch mkinitcpio editieren:
nvim /mnt/etc/mkinitcpio.conf
#change MODULES=() to MODULES=(btrfs)

#------------------BTRFS-END------------

#mkswap -L swap /dev/sda2


#mount (linux + swap + boot)

#mount -L arch /mnt

#ACHTUNG: mit btrfs wird die efi partition nur nach /efi gemounted
#damit /boot in snapshots enthalten ist.

mkdir -p /mnt/boot
mkdir -p /mnt/efi
mount -L EFIBOOT /mnt/efi

#swapon -L swap





# ------------------------ BASIC SYSTEM ---------------------------

# pacman mirrorlist config:
# reflector -c Germany -a 12 --sort rate --save /etc/pacman.d/mirrorlist

# pacman basic packages
pacstrap /mnt base base-devel linux bash-completion dhcp dhcpcd dhclient btrfs-progs reflector

# intel:
pacstrap /mnt intel-ucode

# basic work stuff
pacstrap /mnt vim neovim git wget unzip
# efi  stuff
pacstrap /mnt dosfstools 

# wlan
pacstrap /mnt wpa_supplicant netctl dialog openssh




# fstab
genfstab -U -p /mnt/ > /mnt/etc/fstab


#Locale copy. needed by next script to generate locales in arch_chroot
cat /etc/locale.gen | sed 's/#de_DE/de_DE/' | sed 's/#en_US/en_US/' > /mnt/etc/locale.gen 


echo 'DOTO: fstab relatime -> noatime + discard'
# siehe auch mount options fuer btrfs


