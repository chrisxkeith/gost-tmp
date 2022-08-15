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
  async function getGrantCount(xpath) {
    let numGrants = 0
    let retries = 30
    while (retries > 0 && numGrants == 0) {
      let ele = await driver.wait(until.elementLocated(By.xpath(xpath)), 10000)
      let txt = await ele.getText()
      let counts = txt.split(' of ')
      if (counts.length != 2) {
        throw new Error('Could not get grant count from: ' + txt)
      }
      numGrants = parseInt(counts[1])
      if (numGrants == 0) {
        await sleep(1)
      }
      retries--
    }
    return numGrants
  }
  async function goToTab(tabName) {
    let myGrants = await driver.wait(until.elementLocated(By.linkText(tabName)), 10000)
    await myGrants.click()
  } 
  async function getGrantIdAtIndex(rowIndex, xpathPrefix) {
    let ele = await driver.wait(until.elementLocated(By.xpath(xpathPrefix + rowIndex  + ']/td[1]')), 10000)
    return await ele.getText()
  } 
  async function goToNextPage() {
    let ele = await driver.wait(until.elementLocated(By.xpath(
      '/html/body/div/div/div[1]/div/div[2]/div[1]/section/div[3]/ul/li[4]/button')), 10000)
    await ele.click()
  }
  async function getMyGrants() {
    await goToTab("My Grants")
    let numMyGrants = await getGrantCount("/html/body/div/div/div[1]/div/div[2]/div[1]/section/div[3]/button")
    let ret = new Set()
    let rowIndex = 1
    while (numMyGrants > 0) {
      ret.add(await getGrantIdAtIndex(rowIndex, '/html/body/div/div/div[1]/div/div[2]/div[1]/section/div[2]/table/tbody/tr['))
      rowIndex++
      if (rowIndex > 10) {
        await goToNextPage()
        rowIndex = 1
      }
      numMyGrants--
    }
    return ret
  }
  async function findNewGrant(myGrants) {
    await goToTab("Grants")
    let numGrants = await getGrantCount("/html/body/div/div/div[1]/section/div[4]/button")
    let rowIndex = 1
    while (numGrants > 0) {
      let grantId = await getGrantIdAtIndex(rowIndex, '/html/body/div/div/div[1]/section/div[3]/table/tbody/tr[')
      if (!myGrants.has(grantId)) {
        return grantId
      }
      rowIndex++
      if (rowIndex > 10) {
        // TODO: verify this xpath
        let ele = await driver.wait(until.elementLocated(By.xpath(
          '//*[@id="app"]/div/div[1]/section/div[4]/button')), 10000)
        await ele.click()
        rowIndex = 1
      }
      numGrants--
    }
    throw new Error('Could not find unassigned grant.')
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
    let newGrantId = await findNewGrant(myGrants) // Find a grant not in that list.
    await addGrantToMyGrants(newGrantId)
    await verifyGrantInList(newGrantId)
    await removeGrantFromMyGrants(newGrantId)
    await verifyGrantNotInList(newGrantId)
    await sleep(60 * 60)
  })
})
