// Winston
const { initWinston } = require('./winston')

// Chronodrive
const { crawlChronodrive } = require('./chronodrive')

// Main function
async function main () {
  // Init Winston
  initWinston()

  // Crawl Chronodrive
  crawlChronodrive()
}

main()
