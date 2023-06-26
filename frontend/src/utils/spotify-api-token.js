let token;

setInterval(getSpotifyAccessToken, 3600000);

async function getSpotifyAccessToken() {
  const client_id = process.env.SPOTIFY_CLIENT_ID;
  const client_secret = process.env.SPOTIFY_CLIENT_SECRET;

  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64')),
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: JSON.stringify({
      grant_type: 'client_credentials'
    })
  });

  if (res.ok) {
    const data = await res.json();
    console.log(data);
    token = `${data.token_type} ${data.access_token}`;
    return token;
  }
}

module.exports = {
  spotifyToken: token
}
