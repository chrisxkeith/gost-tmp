# get latest, make sure it runs OK on my machine
set -x
git pull                                                ; if [ $? -ne 0 ] ; then exit -6 ; fi
npx lerna bootstrap                                     ; if [ $? -ne 0 ] ; then exit -6 ; fi
cd packages/server                                      ; if [ $? -ne 0 ] ; then exit -6 ; fi
yarn test                                               ; if [ $? -ne 0 ] ; then exit -6 ; fi
yarn test:apis                                          ; if [ $? -ne 0 ] ; then exit -6 ; fi
cd packages/client                                      ; if [ $? -ne 0 ] ; then exit -6 ; fi
yarn test                                               ; if [ $? -ne 0 ] ; then exit -6 ; fi
cd ../..                                                ; if [ $? -ne 0 ] ; then exit -6 ; fi
yarn start:server
