''' Generate grant data for testing https://github.com/usdigitalresponse/usdr-gost/issues/425
'''

from datetime import datetime
from datetime import timedelta
import time
import json
import os

class GrantGenerator:
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

    def generate(self):
        grant = {
            'status': 'inbox',
            'grand_id' : 'to come',
            'grant_number' :'grant-number-'
            'agency_code': 'NSF',
            'award_ceiling': '6500',
            'cost_sharing': 'No',
            'title' : 'Test Grant '
            'cfda_list': '47.050',
            'open_date' :  'to come'
            'close_date' :  'to come'
            'notes': 'auto-inserted by script',
            'search_terms': '[in title/desc]+',
            'reviewer_name': 'none',
            'opportunity_category': 'Discretionary',
            'description' : '<p>Test Grant Description</p>'
            'eligibility_codes': '25',
            'opportunity_status': 'posted',
            'raw_body': 'raw body',
            'created_at': '2021-08-11 11:30:38.89828-07',
            'updated_at': '2021-08-11 12:30:39.531-07',
        }
        fn = 'grant-test-data.js'
        if os.path.exists(fn):
            os.remove(fn)
        with open(fn, 'a') as f:
            f.write('[\n')
            grant_id = 666666
            open_date = datetime(2021, 8, 11)
            close_date = datetime(2021, 11, 3)
            one_day_delta = timedelta(days=1)
            for grant_num in range(25):
                grant_id_str = str(grant_id)
                grant['grand_id'] = grant_id_str
                grant['grant_number'] = 'grant-number-' + grant_id_str
                grant['title'] = 'Test Grant ' + grant_id_str
                grant['open_date'] = open_date.isoformat()
                grant['close_date'] = close_date.isoformat()
                grant['description'] = '<p>Test Grant Description ' + grant_id_str + '</p>'
                f.write(json.dumps(grant, indent = 2))
                if grant_num < 24:
                    f.write(',')
                f.write('\n')
                grant_id = grant_id + 10
                open_date += one_day_delta
                close_date -= one_day_delta
            f.write(']')

    def run(self):
        self.log('Started')
        started = time.time()
        self.generate()
        self.log('Ended: ' + self.getElapsedStr(started))

if __name__ == "__main__":
    grantGenerator = GrantGenerator()
    grantGenerator.run()
