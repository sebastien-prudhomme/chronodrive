// Winston
const { initWinston } = require('./winston')

// Chronodrive
const { crawlChronodrive } = require('./chronodrive')

// SleepJS
const { sleepMinutes } = require('sleepjs')

// Exit function
function exitProcess() {
  process.exit(0)
}

// Main function
async function main () {
  process.on('SIGINT', exitProcess)
  process.on('SIGTERM', exitProcess)

  // Init Winston
  initWinston()

  while (true) {
    // Crawl Chronodrive
    crawlChronodrive()

    // Sleep
    await sleepMinutes(process.env.SLEEP)
  }
}

main()
