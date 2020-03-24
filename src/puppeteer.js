// Puppeteer
const puppeteer = require('puppeteer')

// Bottleneck
const Bottleneck = require('bottleneck')

// Constants
const PUPPETEER_HEADLESS = true

// Variables
let bottleneck
let browser
let browserPage

// Get Bottleneck instance
function getBottleneck () {
  return bottleneck
}

// Get Puppeteer browser page
function getBrowserPage () {
  return browserPage
}

// Init Puppeteer
async function initPuppeteer (bottleneckMinTime) {
  browser = await puppeteer.launch({
    args: ['--no-sandbox'],
    headless: PUPPETEER_HEADLESS
  })

  browserPage = (await browser.pages())[0]

  // Init Bottleneck
  bottleneck = new Bottleneck({ minTime: bottleneckMinTime })
}

// Shutdown Puppeteer
async function shutdownPuppeteer () {
  if (browser) {
    await browser.close()
  }
}

async function gotoPage (url, listener) {
  await browserPage.setRequestInterception(true)
  browserPage.on('request', listener)

  let response

  try {
    response = await bottleneck.schedule(() => browserPage.goto(url))
  } finally {
    browserPage.off('request', listener)
    await browserPage.setRequestInterception(false)
  }

  return response
}

// Validate response status
function validateStatus (response) {
  if (!response.ok()) {
    const error = new Error(`Request failed with status code ${response.status()}`)
    error.response = response

    throw error
  }
}

module.exports.getBottleneck = getBottleneck
module.exports.getBrowserPage = getBrowserPage
module.exports.gotoPage = gotoPage
module.exports.initPuppeteer = initPuppeteer
module.exports.shutdownPuppeteer = shutdownPuppeteer
module.exports.validateStatus = validateStatus
