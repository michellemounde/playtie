const puppeteer = require('puppeteer');

// Browser instance creator
async function startBrowser() {
  let browser;

  try {
    console.log('Opening the browser...');
    browser = await puppeteer.launch({
      headless: process.env.NODE_ENV === 'production',
      args: ['--disable-setuid-sandbox'],
      ignoreHTTPSErrors: true,
    });
  } catch (err) {
    console.warn('Could not create a browser instance => : ', err);
  }

  return browser;
}

// Page Scraper
const pageScraper = {
  async scraper(browser) {
    const page = await browser.newPage();

    await page.goto(this.url);

    // Wait for the required DOM to be rendered
    const header = await page.waitForSelector('div.immersive-header-content');
    const list = await page.waitForSelector('ytd-section-list-renderer');

    // Get playlist name and songs
    const name = await header.$eval('yt-formatted-string', (title) => title.textContent);
    const songs = await list.$$eval(
      '.ytd-playlist-video-list-renderer > ytd-playlist-video-renderer',
      (targetSongs) => {
        targetSongs = targetSongs.map((el) => el.querySelector('h3 > a').title);
        return targetSongs;
      },
    );

    await browser.close();

    return { name, songs };
  },
};

// Scraper Controller
async function scraperController(browserInstance, url) {
  let browser;

  try {
    browser = await browserInstance;
    pageScraper.url = url;
    const playlist = await pageScraper.scraper(browser);
    return playlist;
  } catch (err) {
    console.warn('Could not resolve the browser instance => : ', err);
  }
}

// Initialize scraping
module.exports = {
  startBrowser,
  scraperController,
};
