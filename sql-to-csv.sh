set echo
# Edit output from PSQL pg_dump into CSV for import into Google Sheets.
# Must manually add column headers.
for f in $(ls *.sql) ; do
    tgt=$(echo $f | sed -e s/.sql/.csv/)
    echo $tgt
    cat $f | grep 'INSERT INTO' | \
        sed -e s/'^.* VALUES ('//g | \
        sed -e s/');'//g | \
        sed -e "s/'/"'\"'/g > $tgt
done