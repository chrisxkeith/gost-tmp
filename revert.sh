# Use as a template for cleaning up from save_branch.sh . Must run from usdr-gost/ .
set -x

branch=830-fix-grant-export-to-csv

for f in \
.gitignore \
packages/server/__tests__/arpa_reporter/server/fixtures/add-dummy-data.js \
packages/server/__tests__/arpa_reporter/server/mocha_wrapper.sh \
packages/server/__tests__/arpa_reporter/server/reset-db.sh \
packages/server/package.json ; do
    git checkout -f $branch -- $f                         ; if [ $? -ne 0 ] ; then exit -6 ; fi                                                
done

for f in \
packages/server/.vscode/launch.json \
packages/server/.vscode/settings.json \
packages/server/.vscode/tasks.json \
packages/server/__tests__/arpa_reporter/server/mocha_setup.sh ; do
    rm -f $f                                            ; if [ $? -ne 0 ] ; then exit -6 ; fi                                                
done
