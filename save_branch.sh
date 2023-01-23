# template for copying off a branch and restoring it
set -x

# for f in \
# packages/client/public/agencyImportTemplate.xlsx \
# ...
# packages/server/src/routes/agencies.js ; do cp $f .. ; if [ $? -ne 0 ] ; then exit -6 ; fi ; done

git pull
git checkout _staging

# cp ../agencyImportTemplate.xlsx packages/client/public/             ; if [ $? -ne 0 ] ; then exit -6 ; fi
