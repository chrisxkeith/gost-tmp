git pull ;                                            if (-not $?) { Exit }
npx lerna bootstrap;                                  if (-not $?) { Exit }

# if necessary: npm install -g mocha
cd packages\server;                                   if (-not $?) { Exit }
.env.ps1                                              if (-not $?) { Exit }
$Env:NODE_ENV="test";
mocha --timeout 10000 __tests__/db/*.test.js;         if (-not $?) { Exit }

# TODO:
# $Env:SUPPRESS_EMAIL="TRUE"
# ode src > test.log
# $Env:TEST_SERVER_PID=$?
# mocha --exit --bail --require __tests__/api/fixtures.js __tests__/api/*.test.js
# $Env:TEST_RET_VAL=$?
# kill $TEST_SERVER_PID
# exit $Env:TEST_RET_VAL
