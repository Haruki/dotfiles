# 1: Tastatureinstellungen auf latin1 mit nodeadkeys
loadkeys de-latin1-nodeadkeys

# 2: Festplatte partitionieren (EFI oder BIOS), gdisk oder fdisk
gdisk /dev/sda

# 3: git, neovim und tmux nachinstallieren für weitere installation (per skript)
pacman -Sy
pacman -S neovim tmux git

# 4: dotfiles clonen (/tmp)
cd /tmp
git clone https://github.com/haruki/dotfiles


