# get latest, make sure it runs OK on my machine
# May have to give sudo password.

set -x
sudo service postgresql start				            ; if [ $? -ne 0 ] ; then exit -6 ; fi
git pull                                                ; if [ $? -ne 0 ] ; then exit -6 ; fi
npx lerna bootstrap                                     ; if [ $? -ne 0 ] ; then exit -6 ; fi
cd packages/server                                      ; if [ $? -ne 0 ] ; then exit -6 ; fi
yarn test                                               ; if [ $? -ne 0 ] ; then exit -6 ; fi

# Tests may fail first time around,
#  probably due to the server cold-starting,
# and test harness not waiting for it.
# Just run it again.

yarn test:apis                                          ; if [ $? -ne 0 ] ; then exit -6 ; fi
cd ../../packages/client                                ; if [ $? -ne 0 ] ; then exit -6 ; fi
yarn test                                               ; if [ $? -ne 0 ] ; then exit -6 ; fi
cd ../..                                                ; if [ $? -ne 0 ] ; then exit -6 ; fi
yarn start:client &
yarn debug:server
