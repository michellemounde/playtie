const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
const redirectUri = process.env.NODE_ENV === 'production' ? 'https://playtie.onrender.com/' : 'http://localhost:3000/';


const generateRandomString = (length) => {
  let text = '';
  let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}


const generateCodeChallenge = async (codeVerifier) => {
  function base64encode(string) {
    return btoa(String.fromCharCode.apply(null, new Uint8Array(string)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }

  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const digest = await window.crypto.subtle.digest('SHA-256', data);

  return base64encode(digest);
}


const authenticate = async() => {
  const codeVerifier = generateRandomString(128);

  generateCodeChallenge(codeVerifier)
    .then(codeChallenge => {
      const state = generateRandomString(16);
      const scope = 'user-read-private user-read-email';

      localStorage.setItem('code_verifier', codeVerifier);

      const args = new URLSearchParams({
        response_type: 'code',
        client_id: clientId,
        scope: scope,
        redirect_uri: redirectUri,
        state: state,
        code_challenge_method: 'S256',
        code_challenge: codeChallenge
      });

      window.location = 'https://accounts.spotify.com/authorize?' + args;
    })
}


const requestAccessToken = async (code) => {
  const codeVerifier = localStorage.getItem('code_verifier');

  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code: code,
    redirect_uri: redirectUri,
    client_id: clientId,
    code_verifier: codeVerifier
  });

  fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: body
  })
    .then(response => {
      if (!response.ok) throw new Error('HTTP status ' + response.status);
      return response.json();
    })
    .then(data => {
      debugger
      // TODO check data
      localStorage.setItem('access_token', data.access_token)
      localStorage.setItem('refresh_token', data.refresh_token)
    })
    .catch(error => {
      console.error('Error:', error);
    });
}


const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem('refresh_token');

  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
    client_id: clientId
  });

  fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: body
  })
    .then(response => {
      if (!response.ok) throw new Error('HTTP status ' + response.status);
      return response.json();
    })
    .then(data => {
      debugger
      // TODO check if there is a refesh token sent back here but I don't think so
      localStorage.setItem('access_token', data.access_token)
    })
    .catch(error => {
      console.error('Error:', error);
    });
}


module.exports = {
  authenticate,
  requestAccessToken,
  refreshAccessToken
};
