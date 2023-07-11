const express = require('express');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const { generateRandomString } = require('../../utils/spotify');

const router = express.Router();

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
const url =  process.env.NODE_ENV === 'production' ? 'https://playtie.onrender.com' : 'http://localhost:3000';
const redirectUri = url;
const stateKey = 'spotify_auth_state';

// Login user to Spotify
// GET /auth
router.get('/', (req, res, next) => {
  const state = generateRandomString(16);
  res.cookie(stateKey, state);

  // App request for authorization
  const scope = 'user-read-private user-read-email';
  const args = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    scope: scope,
    redirect_uri: redirectUri,
    state: state,
  }).toString();

  res.redirect('https://accounts.spotify.com/authorize?' + args);
});


// Logout user from Spotify
// DELETE /spotify/
router.delete('/', (req, res, next) => {

})


// Request access token
// POST /auth/'
router.post('/', (req, res, next) => {
  const { code, state } = req.body;
  const storedState = req.cookies ? req.cookies[stateKey] : null;
  let authOptions;

  if (state === null || state !== storedState) {
    const args = new URLSearchParams({
      error: 'state_mismatch'
    }).toString();
    res.redirect(`${url}/#` + args);
  } else {
    res.clearCookie(stateKey);
    authOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + (new Buffer.from(clientId + ':' + clientSecret).toString('base64'))
      },
      body: JSON.stringify({
        code: code,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code'
      })
    }
  }

  fetch('https://accounts.spotify.com/api/token', authOptions)
    .then(res => res.json())
    .then(data => {
      console.log(data);
      const accessToken = body.access_token;
      const refreshToken = body.refresh_token;

      // we can also pass the token to the browser to make requests from there
      res.redirect(`${url}/#` +
        new URLSearchParams({
          access_token: accessToken,
          refresh_token: refreshToken
        }).toString()
      );
    })
    .catch(err => {
      res.redirect(`${url}/#` +
        new URLSearchParams({
          error: 'invalid_token',
          error_description: err
        }).toString()
      );
    })
});

// Refresh access token
// GET /auth/refresh-token
router.get('/refresh-token', (req, res, next) => {
  const refreshToken = req.query.refresh_token;
  const authOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + (new Buffer.from(clientId + ':' + clientSecret).toString('base64'))
    },
    body: JSON.stringify({
      grant_type: 'refresh_token',
      refresh_token: refreshToken
    })
  };

  fetch('https://accounts.spotify.com/api/token', authOptions)
    .then(res => res.json())
    .then(data => {
      const accessToken = data.access_token;
      res.send({
        'access_token': accessToken
      });
    })
    .catch(err => {
      console.err(err);
    })

});


module.exports = router;
