const express = require('express');

const fetch = (...args) => import('node-fetch').then(({ default: targetFetch }) => targetFetch(...args));

const router = express.Router();

// Get user profile
// GET /spotify/user
router.get('/user', (req, res, next) => {
  const accessToken = req.query.access_token;

  // use the access token to access the Spotify Web API
  fetch('https://api.spotify.com/v1/me', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
  })
    .then((resp) => resp.json())
    .then((data) => console.log(data));
});

module.exports = router;
