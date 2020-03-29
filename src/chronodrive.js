// Winston
const winston = require('winston')

// Puppeteer
const { getBrowserPage, gotoPage, initPuppeteer, shutdownPuppeteer } = require('./puppeteer')

// Nodemailer
const nodemailer = require('nodemailer')

// Constants
const BOTTLENECK_MIN_TIME = 1 * 1000

// Crawl function
async function crawlChronodrive () {
  try {
    // Init Puppeteer
    await initPuppeteer(BOTTLENECK_MIN_TIME)

    // Launch crawl
    const listener = (request) => {
      request.continue()
    }

    await gotoPage('https://www.chronodrive.com/', listener)
    await getBrowserPage().waitFor(2000)

    await getBrowserPage().$eval('#searchField', (element, magasin) => element.value = magasin, process.env.MAGASIN)
    await getBrowserPage().click('#linksubmit')
    await getBrowserPage().waitFor(2000)

    await getBrowserPage().click('#resultZone > ul > li:nth-child(1) > div.actions-btn > a:nth-child(2)')
    await getBrowserPage().waitFor(2000)

    await gotoPage('https://www.chronodrive.com/login', listener)
    await getBrowserPage().waitFor(2000)

    await getBrowserPage().$eval('#email_login', (element, login) => element.value = login, process.env.LOGIN)
    await getBrowserPage().$eval('#pwd_login', (element, password) => element.value = password, process.env.PASSWORD)
    await getBrowserPage().click('#loginForm > button')
    await getBrowserPage().waitFor(2000)

    const message = await getBrowserPage().$eval('#m_panier > div.dispo.dispo--added', element => element.innerText)

    winston.info(`crawlChronodrive;${message}`)

    if (['Pas de créneau disponible', 'Pas de créneaux disponibles'].include(message) === false ) {
      const options = {
        host: process.env.MAILER_HOST,
        port: process.env.MAILER_PORT,
        auth: {
          user: process.env.MAILER_AUTH_USER,
          pass: process.env.MAILER_AUTH_PASS
        }
      }

      const mailerTransporter = nodemailer.createTransport(options)

      const mail = {
        from: process.env.MAIL_FROM,
        to: process.env.MAIL_TO,
        subject: `[CHRONODRIVE] ${message}`
      }

      await mailerTransporter.sendMail(mail)

      process.exit(0)
    }
  } catch (error) {
    winston.log({ level: 'error', message: error })
  } finally {
    // Shutdown Puppeteer
    await shutdownPuppeteer()
  }
}

module.exports.crawlChronodrive = crawlChronodrive
