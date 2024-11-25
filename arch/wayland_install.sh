# wayland + hyprland + kitty + fonts + basic config

sudo pacman -S mesa libva-intel-driver intel-media-driver mesa-utils mesa-demos 

# hyprland+kitty + wayland dependencies
sudo pacman -S hyprland kitty wayland xorg-xwayland wlroots polkit xdg-desktop-portal-hyprland

# login manager
sudo pacman -S greetd greetd-tuigreet

#Quality of life tools:

#swaylock: Lock the screen on Wayland.
#grim: Take screenshots under Wayland.
#slurp: Select a screen region interactively, typically used with grim.
#wofi: A Wayland-native application launcher and window switcher.
#brightnessctl: Control display brightness from the command line.
sudo pacman -S swaylock grim slurp wofi brightnessctl 


# font
mkdir ~/.local/share/fonts
wget "https://github.com/romkatv/dotfiles-public/raw/master/.local/share/fonts/NerdFonts/MesloLGS%20NF%20Regular.ttf" -o MesloLGS.ttf
fc-cache
fc-list

# system tray
sudo pacman -S waybar