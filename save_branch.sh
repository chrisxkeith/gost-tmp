# Use as a template for copying off a branch and restoring it. Must run from usdr-gost/ .
set -x

git checkout checkout 830-fix-grant-export-to-csv-2
git pull

for f in \
packages/client/src/components/GrantsTable.vue \
packages/server/__tests__/api/grants.test.js \
packages/server/__tests__/db/db.test.js \
packages/server/src/routes/grants.js ; do
    cp $f ..                                                    ; if [ $? -ne 0 ] ; then exit -6 ; fi
done

git checkout 830-fix-grant-export-to-csv-2                      ; if [ $? -ne 0 ] ; then exit -6 ; fi
git pull

cp ../GrantsTable.vue packages/client/src/components/
cp ../grants.test.js packages/server/__tests__/api/
cp ../db.test.js packages/server/__tests__/db/
cp ../grants.js packages/server/src/routes/
