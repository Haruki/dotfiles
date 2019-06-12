#!/bin/sh

#execute last before reboot into new system
#virtualbox + efi only

mkdir /boot/EFI/boot
cp /boot/EFI/grub/grubx64.efi /boot/EFI/BOOT/BOOTX86.EFI

echo 'bcfg boot add 1 fs0:/EFI/arch/grubx64.efi "Manually Added"' > /boot/startup.nsh
echo 'exit' >> /boot/startup.nsh

