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

// Submit playlist link
// POST /
router.post(
  '/',
  validateUrl,
  async (req, res, next) => {
    const { url } = req.body;
    console.log(url);

    const browserInstance = await startBrowser();
    const songTitles = await scraperController(browserInstance, url);

    console.log('songTitles');
    console.log(songTitles);

    return res.json({ songs: songTitles })
  }
)

module.exports = router;
