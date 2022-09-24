# get latest, make sure it runs OK on my machine
# May have to give sudo password.

set -x
sudo service postgresql start				            ; if [ $? -ne 0 ] ; then exit -6 ; fi
git pull                                                ; if [ $? -ne 0 ] ; then exit -6 ; fi
npx lerna bootstrap                                     ; if [ $? -ne 0 ] ; then exit -6 ; fi

# If tests fail, make the following change:
# --- a/packages/server/package.json
# +++ b/packages/server/package.json
#@@ -23,7 +23,7 @@
#-    "test:apis": "NODE_ENV=test SUPPRESS_EMAIL=TRUE node src > test.log & TEST_SERVER_PID=$!; NODE_ENV=test mocha --exit --bail --require __tests__/api/fixtures.js __tests__/api/*.test.js; TEST_RET_VAL=$?; kill $TEST_SERVER_PID; exit $TEST_RET_VAL",
#+    "test:apis": "NODE_ENV=test SUPPRESS_EMAIL=TRUE node src > test.log & TEST_SERVER_PID=$!; sleep 15; NODE_ENV=test mocha --exit --bail --require __tests__/api/fixtures.js __tests__/api/*.test.js; TEST_RET_VAL=$?; kill $TEST_SERVER_PID; exit $TEST_RET_VAL",

cd packages/server                                      ; if [ $? -ne 0 ] ; then exit -6 ; fi
yarn test                                               ; if [ $? -ne 0 ] ; then exit -6 ; fi

# No client tests, yet... "0 passing (0ms)""
# cd ../../packages/client                                ; if [ $? -ne 0 ] ; then exit -6 ; fi
# yarn test                                               ; if [ $? -ne 0 ] ; then exit -6 ; fi

cd ../..                                                ; if [ $? -ne 0 ] ; then exit -6 ; fi
yarn start:client
