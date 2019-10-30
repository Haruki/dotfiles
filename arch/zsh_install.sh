#!/bin/sh


#prerequisits:
#standard user must be active

sudo pacman -S zsh
cd ~



#zsh extensions
git clone https://github.com/zsh-users/zsh-syntax-highlighting.git
echo "source ${(q-)PWD}/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh" >> ${ZDOTDIR:-$HOME}/.zshrc

