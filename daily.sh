echo "Only for non-docker environment"
exit 0
# Get latest, make sure it runs OK on my machine.
# May have to give sudo password.

echo "--------------------------------------------------------------------------------"
date
set -x
sudo service postgresql start				            ; if [ $? -ne 0 ] ; then exit -6 ; fi
git pull                                                ; if [ $? -ne 0 ] ; then exit -6 ; fi
npx lerna bootstrap                                     ; if [ $? -ne 0 ] ; then exit -6 ; fi

cd packages/server                                      ; if [ $? -ne 0 ] ; then exit -6 ; fi
# Until tests are more reliable, don't check return code here.
yarn test                                               # ; if [ $? -ne 0 ] ; then exit -6 ; fi

cd ../../packages/client                                ; if [ $? -ne 0 ] ; then exit -6 ; fi
yarn test                                               ; if [ $? -ne 0 ] ; then exit -6 ; fi

cd ../..                                                ; if [ $? -ne 0 ] ; then exit -6 ; fi
echo "Run 'yarn start:client' in a separate terminal window."
date
echo "--------------------------------------------------------------------------------"
yarn debug:server
