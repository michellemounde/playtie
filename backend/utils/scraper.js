const puppeteer = require('puppeteer');

// Browser instance creator
async function startBrowser() {
  let browser;

  try {
    console.log("Opening the browser...");
    browser = await puppeteer.launch({
      headless: false,
      args: ["--disable-setuid-sandbox"],
      'ignoreHTTPSErrors': true
    })
  } catch (err) {
    console.warn("Could not create a browser instance => : ", err)
  }

  return browser;
}

// Page Scraper
const pageScraper = {
  url: 'http://books.toscrape.com',
  async scraper(browser) {
    let page = await browser.newPage();
    console.log(`Navigating to ${this.url}...`);
    await page.goto(this.url)
  }
}

// Initialize browser instance
let browserInstance = startBrowser();

// Scraper Controller
async function scraperController(browserInstance) {
  let browser;

  try {
    browser = await browserInstance;
    await pageScraper.scraper(browser);
  } catch (err) {
    console.warn("Could not resolve the browser instance => : ", err)
  }
}

// Initialize scraping
scraperController(browserInstance);
