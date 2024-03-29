// To get latest dependencies (run from inside repository root directory):
// npm install
// npm upgrade

const fs = require('fs');
const https = require('https');
const yauzl = require('yauzl');
const XmlStream = require('xml-stream');
const { env } = require('process');

function logIt(logLine) {
    console.log(`${(new Date()).toUTCString()} ${logLine}`);
}

const msPerDay = 24 * 60 * 60 * 1000; // Number of milliseconds per day

function getFileDateStr() {
    // Looks like files are generated a little after 4:30pm (Eastern Time Zone).
    // Therefore getting yesterday's file should always succeed,
    // regardless of what time of day this is run.
    const now = new Date();
    const yesterday = now.setDate(now.getDate() - 1);
    const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(yesterday);
    const mo = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(yesterday);
    const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(yesterday);
    return `${ye}${mo}${da}`;
}

function extractDateComponents(dateStr) {
    return {
        month: dateStr.substring(0, 2),
        day: dateStr.substring(2, 4),
        year: dateStr.substring(4, 8),
    };
}

function dateFromStr(dateStr) {
    if (!dateStr) {
        return undefined;
    }
    const dateComponents = extractDateComponents(dateStr);
    return new Date(
        parseInt(dateComponents.year, 10),
        parseInt(dateComponents.month, 10) - 1,
        parseInt(dateComponents.day, 10),
    );
}

function sqlDateFromDate(dateStr) {
    const theDate = dateFromStr(dateStr);
    const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(theDate);
    const mo = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(theDate);
    const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(theDate);
    return `${ye}-${mo}-${da}`;
}

function createRawBody(grantFromXML) {
    const body = {
        synopsis : {
            agency_name : grantFromXML.AgencyName,
            awardFloor : grantFromXML.AwardFloor
        }
    };
    return JSON.stringify(body);
}

function createRow(grantFromXML) {
    return {
        status: 'inbox',
        grant_id: parseInt(grantFromXML.OpportunityID, 10),
        grant_number: grantFromXML.OpportunityNumber,
        agency_code: grantFromXML.AgencyCode,
        award_ceiling: (grantFromXML.AwardCeiling && parseInt(grantFromXML.AwardCeiling, 10))
            ? parseInt(grantFromXML.AwardCeiling, 10) : undefined,
        cost_sharing: grantFromXML.CostSharingOrMatchingRequirement,
        title: grantFromXML.OpportunityTitle,
        cfda_list: grantFromXML.CFDANumbers, // TODO: Couldn't find any grants with multiple numbers. See https://github.com/usdigitalresponse/usdr-gost/blob/836eb737fa9a353515eb8fde4ef7f47eaf81c0e1/packages/server/src/lib/grantscraper/index.js#L22
        open_date: sqlDateFromDate(grantFromXML.PostDate),
        close_date: sqlDateFromDate(grantFromXML.CloseDate) || '2100-01-01',
        notes: 'auto-inserted by script',
        search_terms: '', // TODO: Now unused?
        reviewer_name: 'none',
        opportunity_category: grantFromXML.OpportunityCategory,
        description: grantFromXML.Description,
        eligibility_codes: grantFromXML.EligibleApplicants,
        opportunity_status: '??? TODO',
        raw_body: createRawBody(grantFromXML), 
    };
}

// eslint-disable-next-line no-unused-vars
function writeSQL(grantFromXML) {
    let insertStr = 'insert into TABLE (';
    let valueStr = ' values (';
    let first = true;
    for (const property in grantFromXML) {
        if (!first) {
            insertStr = insertStr.concat(', ');
            valueStr = valueStr.concat(', ');
        } else {
            first = false;
        }
        insertStr = insertStr.concat(`${property}`);
        let val;
        if (['ExpectedNumberOfAwards', 'AwardCeiling', 'AwardFloor'].includes(property)) { // numeric
            val = grantFromXML[property];
        } else if (['PostDate', 'LastUpdatedDate'].includes(property)) { // date
            val = dateFromStr(grantFromXML[property]);
        } else { // string
            val = `'${grantFromXML[property].replaceAll(`'`, `''`)}'`;
        }
        valueStr = valueStr.concat(`${val}`);
    }
    const sql = `${insertStr}) ${valueStr})`;
    console.log(sql);
}

// eslint-disable-next-line no-unused-vars
function getAwardInterval(preAwardIntervals, grant) {
    if (grant && grant.PostDate && grant.CloseDate && grant.CloseDate !== '01012099') {
        const openedDate = dateFromStr(grant.PostDate);
        const closedDate = dateFromStr(grant.CloseDate);
        if (openedDate && closedDate) {
            const days = Math.round((closedDate.getTime() - openedDate.getTime()) / msPerDay);
            const grantDetails = `award interval (${days} days) for: '${grant.OpportunityTitle}', \
grant.PostDate ${grant.PostDate}, grant.CloseDate: ${grant.CloseDate}, \
grant.LastUpdatedDate: ${grant.LastUpdatedDate}`;
            // Warn about possible bad data.
            if (days > 365 * 11) {
                console.log(`Large ${grantDetails}`);
            } else if (days < 1) {
                console.log(`Small ${grantDetails}`);
            } else {
                preAwardIntervals.push(days);
            }
        }
    }
}

// eslint-disable-next-line no-unused-vars
function readFieldNames(xmlFileName) {
    const stream = fs.createReadStream(xmlFileName);
    const xml = new XmlStream(stream);
    const fieldNames = {};
    let totalGrantCount = 0;
    xml.on('endElement: OpportunitySynopsisDetail_1_0', (grant) => {
        totalGrantCount += 1;
        // eslint-disable-next-line no-restricted-syntax
        for (const key of Object.keys(grant)) {
            if (fieldNames[key]) {
                fieldNames[key] += 1;
            } else {
                fieldNames[key] = 1;
            }
        }
    });
    // eslint-disable-next-line no-unused-vars
    xml.on('endElement: Grants', (theDoc) => {
        logIt(`Finished readFieldNames from: ${xmlFileName}, totalGrantCount: ${totalGrantCount}`);
        const fieldnameFile = `./GrantsDBExtract${getFileDateStr()}v2_fieldnames.txt`;
        let str = '';
        // eslint-disable-next-line no-restricted-syntax
        for (const key of Object.keys(fieldNames)) {
            if (Object.prototype.hasOwnProperty.call(fieldNames, key)) {
                str = `${str}\r\n${key}\t${fieldNames[key]}`;
            }
        }
        fs.writeFileSync(fieldnameFile, str);
    });
}

const median = (arr) => {
    const mid = Math.floor(arr.length / 2);
    const nums = [...arr].sort((a, b) => a - b);
    return arr.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
};

function loadData(xmlFileName, updateFunc) {
    const now = new Date();
    let dateRange;
    if (env.GRANTS_SCRAPER_DATE_RANGE) {
        dateRange = parseInt(env.GRANTS_SCRAPER_DATE_RANGE, 10);
    } else {
        dateRange = 365 * 20; // Process all grants in file.
    }
    logIt(`Starting processing for grants back ${dateRange} days`);
    const stream = fs.createReadStream(xmlFileName);
    const xml = new XmlStream(stream);
    let totalGrantCount = 0;
    let processedGrantCount = 0;
    // eslint-disable-next-line no-unused-vars
    const preAwardIntervals = [];
    // eslint-disable-next-line no-unused-vars
    const cfdaEntries = new Set();
    xml.on('endElement: OpportunitySynopsisDetail_1_0', (grant) => {
        totalGrantCount += 1;
        const postDate = dateFromStr(grant.PostDate);
        let days = (now.getTime() - postDate.getTime()) / msPerDay;
        days = Math.round(days);
        if (days <= dateRange) {
            // getAwardInterval(preAwardIntervals, grant);
            // cfdaEntries.add(grant.CFDANumbers);
            const row = createRow(grant);
            updateFunc(row);
            processedGrantCount += 1;
        }
    });
    // eslint-disable-next-line no-unused-vars
    xml.on('endElement: Grants', (theDoc) => {
        let totalDays = 0;
        // eslint-disable-next-line no-restricted-syntax
        for (const interval of preAwardIntervals) {
            totalDays += parseInt(interval, 10);
        }
        const min = Math.min(...preAwardIntervals);
        const max = Math.max(...preAwardIntervals);
        const avg = Math.round(totalDays / preAwardIntervals.length);
        // logIt(`# grants: ${preAwardIntervals.length}, min: ${min} days, max: ${max} days, median: ${median(preAwardIntervals)}, avg: ${avg} days`);
        logIt(`Finished processing ${processedGrantCount} grants from: ${xmlFileName}, totalGrantCount: ${totalGrantCount}`);
        for (const item of cfdaEntries) {
            if (item && item.length > 6) {
                logIt(item);
            }
        }
    });
}

function unzipFile(zipFn, updateFunc) {
    const xmlFn = `${zipFn.substring(0, zipFn.length - 3)}xml`;
    const xmlStream = fs.createWriteStream(xmlFn);
    yauzl.open(zipFn, { lazyEntries: true }, (err, zipfile) => {
        if (err) throw err;
        zipfile.readEntry();
        zipfile.on('entry', (entry) => {
            if (/\/$/.test(entry.fileName)) {
                // Directory file names end with '/'. Shouldn't be any, but just in case.
                zipfile.readEntry();
            } else {
                logIt(`Started processing: ${entry.fileName} in ${zipFn}`);
                zipfile.openReadStream(entry, (err2, readStream) => {
                    if (err2) throw err2;
                    readStream.on('end', () => {
                        zipfile.readEntry();
                    });
                    readStream.on('finish', () => {
                        // readFieldNames(xmlFn);
                        loadData(xmlFn, updateFunc);
                    });
                    readStream.pipe(xmlStream);
                });
            }
        });
    });
}

function downloadFile(updateFunc) {
    let zipFn = `GrantsDBExtract${getFileDateStr()}v2.zip`;
    // Can manually check list at https://www.grants.gov/xml-extract.html
    const url = `https://www.grants.gov/extract/${zipFn}`;
    // TODO: Verify that current directory in hosting service is writeable.
    const path = './';

    zipFn = `${path}${zipFn}`;

    if (fs.existsSync(zipFn)) {
        unzipFile(zipFn, updateFunc);
    } else {
        logIt(`Starting download for ${url}`);
        https.get(url, (res) => {
            // File will be stored at this path. createWriteStream() overwrites.
            const theStream = fs.createWriteStream(zipFn);
            res.pipe(theStream);
            theStream.on('finish', () => {
                theStream.close();
                // TO eventually DO: check if file contains '<title>404 Not Found</title>', log error if so.
                logIt(`Finished download for ${url}`);
                unzipFile(zipFn, updateFunc);
            }).on('error', (e) => {
                console.error(`Error when writing "${zipFn}": ${e}`);
            });
        }).on('error', (e) => {
            console.error(`Error when getting "${url}": ${e}`);
        });
    }
}

function updateRow(grant) {
    // console.log(JSON.stringify(grant));
}

downloadFile(updateRow);
