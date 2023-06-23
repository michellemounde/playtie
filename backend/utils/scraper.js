const puppeteer = require('puppeteer');

// Browser instance creator
async function startBrowser() {
  let browser;

  try {
    console.log('Opening the browser...');
    browser = await puppeteer.launch({
      headless: process.env.NODE_ENV === 'production',
      args: ["--disable-setuid-sandbox"],
      'ignoreHTTPSErrors': true
    })
  } catch (err) {
    console.warn('Could not create a browser instance => : ', err)
  }

  return browser;
}

// Page Scraper
const pageScraper = {
  //url: 'http://books.toscrape.com',
  async scraper(browser) {
    let page = await browser.newPage();
    console.log(`Navigating to ${this.url}...`);
    await page.goto(this.url)
    // Wait for the required DOM to be rendered
    await page.waitForSelector('ytd-section-list-renderer');
    // Get the list of song titles
    let titles = await page.$$eval('.ytd-playlist-video-list-renderer > ytd-playlist-video-renderer', songs => {
      songs = songs.map(el => el.querySelector('h3 > a').title)
      return songs;
    })
    console.log(titles);
    return titles;
  }
}

// Scraper Controller
async function scraperController(browserInstance, url) {
  let browser;

  try {
    browser = await browserInstance;
    pageScraper.url = url;
    titles = await pageScraper.scraper(browser);
    return titles;
  } catch (err) {
    console.warn('Could not resolve the browser instance => : ', err)
  }
}

// Initialize scraping
module.exports = {
  startBrowser,
  scraperController
}
