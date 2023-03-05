# Must run some manual steps first, see:
# https://github.com/usdigitalresponse/usdr-gost/wiki/Setting-up-development-environment-in-Docker-on-Windows

# Automate as much of WSL setup as possible.
# If anything fails, bail out.
# You may have to manually provide the sudo password the first time.

set -x
sudo apt update                                             ; if [ $? -ne 0 ] ; then exit -6 ; fi
sudo apt install nodejs -y                                  ; if [ $? -ne 0 ] ; then exit -6 ; fi
sudo apt install npm -y                                     ; if [ $? -ne 0 ] ; then exit -6 ; fi
sudo apt install curl -y                                    ; if [ $? -ne 0 ] ; then exit -6 ; fi
curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash
                                                              if [ $? -ne 0 ] ; then exit -6 ; fi
export NVM_DIR="$HOME/.nvm"                                 ; if [ $? -ne 0 ] ; then exit -6 ; fi
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion" # This loads nvm bash_completion
nvm install 16.14.0                                         ; if [ $? -ne 0 ] ; then exit -6 ; fi
nvm use v16.14.0                                            ; if [ $? -ne 0 ] ; then exit -6 ; fi
nvm alias default node                                      ; if [ $? -ne 0 ] ; then exit -6 ; fi
npm i yarn@^1.22.4 -g                                       ; if [ $? -ne 0 ] ; then exit -6 ; fi
yarn run setup                                              ; if [ $? -ne 0 ] ; then exit -6 ; fi

# cat packages/server/.env.example | grep -v "^#." > packages/server/.env ; if [ $? -ne 0 ] ; then exit -6 ; fi
# cat packages/client/.env.example | grep -v "^#." > packages/client/.env ; if [ $? -ne 0 ] ; then exit -6 ; fi
