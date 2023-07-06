const express = require('express');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { startBrowser, scraperController } = require('../../utils/scraper');

const router = express.Router();

const whitelist = ['www.youtube.com'];

const validateUrl = [
  check('url')
    .notEmpty()
    .isURL({ allow_underscores: true, host_whitelist: whitelist })
    .withMessage('Please provide a Youtube link.'),
  handleValidationErrors
]

// Get Youtube playlist details
// POST /
router.post(
  '/',
  validateUrl,
  async (req, res, next) => {
    const { url } = req.body;

    // Scrape song titles on current platform
    const browserInstance = await startBrowser();
    const playlist = await scraperController(browserInstance, url);

    return res.json({ playlist })
  }
)


module.exports = router;
