# 1: Tastatureinstellungen auf latin1 mit nodeadkeys
loadkeys de-latin1-nodeadkeys

# enable ssh for remote install:
# pacman -Sy
# pacman -S git neovim
# nvim /etc/ssh/sshd_config
# hinzufügen: `PermitRootLogin yes'
# Passwort für root setzen:
# passwd  

# optional: timezone:
# welche gibts?:
timedatectl list-timezones | grep Berlin

#einstellen:
 timedatectl set-timezone Europe/Berlin

# zeit aktualisieren:

#check
timedatectl

# 2: Festplatte partitionieren (EFI oder BIOS), gdisk oder fdisk
gdisk /dev/sda

# 3: git, neovim und tmux nachinstallieren für weitere installation (per skript)
pacman -Sy
pacman -S neovim tmux git

# 4: dotfiles clonen (/tmp)
cd /tmp
git clone https://github.com/haruki/dotfiles


