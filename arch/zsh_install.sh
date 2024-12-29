#!/bin/sh


#prerequisits:
#standard user must be active

sudo pacman -S zsh
cd ~
sudo chsh -s /usr/bin/zsh root
sudo chsh -s /usr/bin/zsh riker
zsh
#exit


#zsh extensions
git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ~/zsh-syntax-highlighting
echo "source ~/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh" >> ~/.zshrc

git clone https://github.com/zsh-users/zsh-autosuggestions ~/zsh-autosuggestions
echo "source ~/zsh-autosuggestions/zsh-autosuggestions.zsh" >> ~/.zshrc

#fasd
# git clone https://github.com/clvv/fasd.git ~/fasd
# cd ~/fasd
# sudo make install
# echo 'eval "$(fasd --init auto)"' >> ~/.zshrc
sudo pacman -S zoxide
echo 'eval "$(zoxide init zsh)"' >> ~/.zshrc

#powerlevel10k
git clone --depth=1 https://github.com/romkatv/powerlevel10k.git ~/powerlevel10k
echo 'source ~/powerlevel10k/powerlevel10k.zsh-theme' >>! ~/.zshrc

#download nerd fonts:
wget https://github.com/ryanoasis/nerd-fonts/releases/download/v2.0.0/UbuntuMono.zip -O ~/UbuntuMono.zip
unzip ~/UbuntuMono.zip -d ~/.local/share/fonts
wget https://github.com/romkatv/dotfiles-public/raw/master/.local/share/fonts/NerdFonts/MesloLGS%20NF%20Regular.ttf -P ~/.local/share/fonts
wget https://github.com/romkatv/dotfiles-public/raw/master/.local/share/fonts/NerdFonts/MesloLGS%20NF%20Bold.ttf -P ~/.local/share/fonts
wget https://github.com/romkatv/dotfiles-public/raw/master/.local/share/fonts/NerdFonts/MesloLGS%20NF%20Italic.ttf -P ~/.local/share/fonts
wget https://github.com/romkatv/dotfiles-public/raw/master/.local/share/fonts/NerdFonts/MesloLGS%20NF%20Bold%20Italic.ttf -P ~/.local/share/fonts
fc-cache

#configure powerlevel10k
#source ~/.zshrc
#p10k configure
