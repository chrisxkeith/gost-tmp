// Minimal grant-to-agency test: add grant to agency, verify, delete it, verify.
// Install:
// - Download Selenium drivers and put on path: https://www.selenium.dev/documentation/webdriver/getting_started/install_drivers/
// - npm i selenium-webdriver assert mocha
// Run: .\node_modules\mocha\bin\mocha
const { Builder, By, Key, until } = require('selenium-webdriver')
const assert = require('assert')

async function sleep(secs) {
  return new Promise(resolve => setTimeout(resolve, secs * 1000));
}

describe('t1', function() {
  this.timeout(60 * 60 * 1000)
  let driver
  let vars
  beforeEach(async function() {
    driver = await new Builder().forBrowser('chrome').build()
    vars = {}
  })
  afterEach(async function() {
    await driver.quit();
  })
    // BVID number is dynamic, don't use it to find element. May be able to use a wildcard, see:
    // https://stackoverflow.com/questions/12495723/using-xpath-wildcards-in-attributes-in-selenium-webdriver
    // selector: #__BVID__87 > section > div.row.align-items-center > button
    // JS Path : document.querySelector("#__BVID__87 > section > div.row.align-items-center > button")
    // XPath: //*[@id="__BVID__87"]/section/div[3]/button
  async function getGrantCount() {
    let ele = await driver.wait(until.elementLocated(By.xpath("/html/body/div/div/div[1]/div/div[2]/div[1]/section/div[3]/button")), 10000)
    let txt = await ele.getText()
    let counts = txt.split(' of ')
    if (counts.length != 2) {
      throw new Error('Could not get grant count from: ' + txt)
    }
    return parseInt(counts[1])
  } 
  async function getMyGrants() {
    let myGrants = await driver.wait(until.elementLocated(By.linkText("My Grants")), 10000)
    await myGrants.click()
    let numMyGrants = await getGrantCount()
    let ret = []
    while (numMyGrants > 0) {
      let rowIndex = 1
      let ele = await driver.wait(until.elementLocated(By.xpath(
          '/html/body/div/div/div[1]/div/div[2]/div[1]/section/div[2]/table/tbody/tr[' + rowIndex  + '1]/td[1]')), 10000)
      txt = await ele.getText()
      ret.push(txt)
      rowIndex++
      if (rowIndex > 11) {
        let ele = await driver.wait(until.elementLocated(By.xpath(
            '/html/body/div/div/div[1]/div/div[2]/div[1]/section/div[3]/ul/li[4]/button')), 10000)
        await ele.click()
        rowIndex = 1
      }
      numMyGrants--
    }
    return ret
  }
  async function getAllGrants() {
  }
  async function findNewGrant(myGrants, allGrants) {
  }
  async function addGrantToMyGrants(grantId) {
    // which sub-status?
  }
  async function verifyGrantInList(grantId) {
  }
  async function removeGrantFromMyGrants(grantId) {
  }
  async function verifyGrantNotInList(grantId) {
  }
  it('add and remove grant from agency', async function() {
    const staging = 'https://gost-grants-tools-staging.onrender.com'  
    const production = 'https://grants.usdigitalresponse.org'
    const chrisKeithCookie = 's:27.KhnoslA3oBEyppwsBGd3q7x7S6Yre+4rUPWCXvtMepM' // Will cookie expire?
    
    await driver.get(staging)
    await driver.manage().addCookie({ name: 'userId', value: chrisKeithCookie });
    driver.navigate().refresh();
    await driver.manage().window().maximize()
    let myGrants = await getMyGrants()
    let allGrants = await getAllGrants()
    let newGrantId = await findNewGrant(myGrants, allGrants) // Find a grant not in that list.
    await addGrantToMyGrants(newGrantId)
    await verifyGrantInList(newGrantId)
    await removeGrantFromMyGrants(newGrantId)
    await verifyGrantNotInList(newGrantId)
    await sleep(60 * 60)
  })
})
