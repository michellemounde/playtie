const express = require('express');

const router = express.Router();

// Submit playlist link
// POST /
router.post('/', (req, res, next) => {
  const { url } = req.body;

  console.log(url);
  return res.json({ link: url})
})

module.exports = router;
