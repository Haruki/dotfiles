set number
set expandtab
set tabstop=4
set shiftwidth=4

set splitbelow
set splitright
set number relativenumber

set wildmode=longest,list,full
set wildmenu

set wildmode=longest,list,full
set wildmenu

augroup numbertoggle
  autocmd!
  autocmd BufEnter,FocusGained,InsertLeave * set relativenumber
  autocmd BufLeave,FocusLost,InsertEnter   * set norelativenumber
augroup END


call plug#begin('~/.local/share/nvim/plugged')
Plug 'junegunn/vim-easy-align'
Plug 'ncm2/ncm2'
Plug 'roxma/nvim-yarp'
Plug 'ncm2/ncm2-path'
Plug 'ncm2/ncm2-go'
Plug 'mattn/emmet-vim'

call plug#end()

autocmd BufEnter * call ncm2#enable_for_buffer()
set completeopt=noinsert,menuone,noselect
let g:user_emmet_leader_key='<tab>'

