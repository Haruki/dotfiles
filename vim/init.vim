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


