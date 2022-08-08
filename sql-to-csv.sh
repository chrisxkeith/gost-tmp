# Edit output from PSQL pg_dump into CSV for import into Google Sheets.

for f in $(ls *.sql) ; do
    tgt=$(echo $f | sed -e s/.sql/.csv/)
    echo $tgt
    headers=$(cat $f | grep 'INSERT INTO' | head -1)
    headers=$(echo $headers | sed -e s/') VALUES.*'//g | sed -e s/^.*'('//g)
    echo $headers > $tgt
    cat $f | grep 'INSERT INTO' | \
        sed -e s/'^.* VALUES ('//g | \
        sed -e s/');'//g | \
        sed -e "s/'/"'\"'/g >> $tgt
done