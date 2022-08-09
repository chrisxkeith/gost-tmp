import re
import csv
from datetime import datetime
import time

class CsvToSql:
    def __init__(self):
        pass

    def log(self, message):
        timeTag = datetime.now()
        print('"' + str(timeTag) + '", ' + message)

    def getElapsedStr(self, start):
        """Utility for displaying elapsed MM:SS.
        """
        theEnd = time.time()
        totalSeconds = int(round(theEnd - start))
        minutes = round(totalSeconds / 60)
        seconds = round(totalSeconds % 60)
        return '{0:0>2}:{1:0>2}'.format(minutes, seconds)

    def createInsert(self, row, columnNames, tableName):
        values = ''
        # Assumes all values are numeric, thus no quotes.
        for colName in columnNames:
            comma = ''
            if values:
                comma = ', '
            values += (comma + colName + ' = ' + row[colName])
        return 'UPDATE ' + tableName + ' SET ' + values + ' WHERE id = ' + row['id'] + ';'

    def createOneSQL(self, row, columnNames, tableName):
        if row['sql_operation'] == 'UPDATED':
            return self.createInsert(row, columnNames, tableName)
        if row['sql_operation'] == 'DELETED':
            return '/* delete not implemented yet */'
        if row['sql_operation'] == 'INSERTED':
            return '/* insert not implemented yet */'
        return ''

    def writeOneSQL(self, fileName):
        columnNames = []
        tableName = ''
        if 'Users' in fileName:
            columnNames = ['role_id', 'agency_id', 'tenant_id']
            tableName = 'users'
        elif 'Agencies' in fileName:
            columnNames = ['parent', 'main_agency_id', 'tenant_id']
            tableName = 'agencies'
        sqls = []
        with open(fileName + '.csv', 'r', newline='') as csv_file:
                csvreader = csv.DictReader(csv_file)
                for row in csvreader:
                    sql = self.createOneSQL(row, columnNames, tableName)
                    if sql:
                        sqls.append(sql + '\n')
        with open(fileName + '.sql', 'w', newline='') as sql_file:
            sql_file.writelines(sqls)
            self.log('Wrote ' + fileName + '.sql')

    def run(self):
        self.log('Started')
        started = time.time()
        for fn in ['GOST staging data - Users', 'GOST staging data - Agencies', 'GOST Production data - Users', 'GOST Production data - Agencies']:
            self.writeOneSQL(fn)
        self.log('Ended: ' + self.getElapsedStr(started))

if __name__ == "__main__":
    csvToSql = CsvToSql()
    csvToSql.run()
