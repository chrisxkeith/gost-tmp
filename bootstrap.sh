# Must run some manual steps first, see:
# https://github.com/usdigitalresponse/usdr-gost/wiki/Setting-up-a-development-environment-on-Windows-using-WSL

# Automate as much of WSL setup as possible.
# If anything fails, bail out.
# You may have to manually provide the sudo password the first time.

sudo apt install nodejs -y                                  ; if [ $? -ne 0 ] ; then exit -6 ; fi
sudo apt install npm -y                                     ; if [ $? -ne 0 ] ; then exit -6 ; fi
sudo apt install curl -y                                    ; if [ $? -ne 0 ] ; then exit -6 ; fi
curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash
                                                              if [ $? -ne 0 ] ; then exit -6 ; fi
export NVM_DIR="$HOME/.nvm"                                 ; if [ $? -ne 0 ] ; then exit -6 ; fi
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion" # This loads nvm bash_completion
nvm install 16.14.0                                         ; if [ $? -ne 0 ] ; then exit -6 ; fi
nvm alias default node                                      ; if [ $? -ne 0 ] ; then exit -6 ; fi
npm i yarn@^1.22.4 -g                                       ; if [ $? -ne 0 ] ; then exit -6 ; fi
yarn run setup                                              ; if [ $? -ne 0 ] ; then exit -6 ; fi
cd packages/client                                          ; if [ $? -ne 0 ] ; then exit -6 ; fi
cp .env.example .env                                        ; if [ $? -ne 0 ] ; then exit -6 ; fi
cd ../server                                                ; if [ $? -ne 0 ] ; then exit -6 ; fi
cat .env.example | grep -v "^#." > .env                     ; if [ $? -ne 0 ] ; then exit -6 ; fi
