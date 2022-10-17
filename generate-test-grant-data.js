const fs = require('fs');

Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

let grant = {
    status: 'inbox',
    grant_id : 'to come',
    grant_number :'grant-number-',
    agency_code : 'NSF',
    award_ceiling: '6500',
    cost_sharing: 'No',
    title : 'Test Grant ',
    cfda_list: '47.050',
    open_date :  'to come',
    close_date :  'to come',
    notes: 'auto-inserted by script',
    search_terms: '[in title/desc]+',
    reviewer_name: 'none',
    opportunity_category: 'Discretionary',
    description : '<p>Test Grant Description</p>',
    eligibility_code: '25',
    opportunity_status: 'posted',
    raw_body: 'raw body',
    created_at: '2021-08-11 11:30:38.89828-07',
    updated_at: '2021-08-11 12:30:39.531-07',
}
let grant_id = 666666
let date_format = '%Y-%m-%d'
let open_date = new Date('2021-08-11T00:00:00')
let close_date = new Date('2021-11-03T00:00:00')
let grants = []

function join(t, a, s) {
    function format(m) {
       let f = new Intl.DateTimeFormat('en', m);
       return f.format(t);
    }
    return a.map(format).join(s);
}
 
let a = [{year: 'numeric'}, {month: 'short'}, {day: 'numeric'}, ];
 
for (let grant_num = 1; grant_num < 25; grant_num++) {
    let grant_id_str = grant_id.toString()
    grant['grant_id'] = grant_id_str
    grant['grant_number'] = 'grant-number-' + grant_id_str
    grant['title'] = 'Test Grant ' + grant_id_str
    grant['open_date'] = join(open_date, a, '-')
    grant['close_date'] = join(close_date, a, '-')
    grant['description'] = '<p>Test Grant Description ' + grant_id_str + '</p>'
    grant_id = grant_id - 10
    open_date.addDays(-1)
    close_date.addDays(1)
    grants.push(grant)
}

let fn = 'grant-test-data.json'
if (fs.existsSync(fn)) {
    fs.unlinkSync(fn)
}
fs.writeFileSync(fn, JSON.stringify(grants, null, 2));

