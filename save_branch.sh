# Use as a template for copying off a branch and restoring it. Must run from usdr-gost/ .
set -x

git checkout 820_nathillardusdr_vscode_testdebug
git pull

for f in \
.gitignore \
packages/server/.vscode/launch.json \
packages/server/.vscode/settings.json \
packages/server/.vscode/tasks.json \
packages/server/__tests__/arpa_reporter/server/fixtures/add-dummy-data.js \
packages/server/__tests__/arpa_reporter/server/mocha_setup.sh \
packages/server/__tests__/arpa_reporter/server/mocha_wrapper.sh \
packages/server/__tests__/arpa_reporter/server/reset-db.sh \
packages/server/package.json ; do
    cp $f ..                                                    ; if [ $? -ne 0 ] ; then exit -6 ; fi
done

git checkout 830-fix-grant-export-to-csv
git pull

cp ../.gitignore .
mkdir packages/server/.vscode/
cp ../launch.json packages/server/.vscode/
cp ../settings.json packages/server/.vscode/
cp ../tasks.json packages/server/.vscode/
cp ../add-dummy-data.js packages/server/__tests__/arpa_reporter/server/fixtures/
cp ../mocha_setup.sh packages/server/__tests__/arpa_reporter/server/
cp ../mocha_wrapper.sh packages/server/__tests__/arpa_reporter/server/
cp ../reset-db.sh packages/server/__tests__/arpa_reporter/server/
cp ../package.json packages/server/
