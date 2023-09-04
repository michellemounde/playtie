import { useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import * as playlistActions from '../../store/playlist';
import * as spotifyActions from '../../store/spotify';

import './Home.css';


const Home = () => {
  const dispatch = useDispatch();

  const [url, setUrl] = useState('');
  const [errors, setErrors] = useState({});

  const youtube = useSelector(state => state.playlist.youtube);
  const spotify = useSelector(state => state.playlist.spotify);

  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');

  const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
  const redirectUri = process.env.NODE_ENV === 'production' ? 'https://playtie.onrender.com/' : 'http://localhost:3000/';

  const userProfile = useMemo(async () => {
    const codeVerifier = localStorage.getItem('code_verifier');

    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: redirectUri,
      client_id: clientId,
      code_verifier: codeVerifier
    });

    console.log(code)

    fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: body
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('HTTP status ' + response.status);
        }
        return response.json();
      })
      .then(data => {
        localStorage.setItem('access_token', data.access_token);
        // TODO dispatch the getUserProfile action from Spotify and set user to button
        // TODO is this needed? const payload = { data.access_token };
        dispatch(spotifyActions.getUserProfile())
          .catch(async (res) => {
            const data = await res.json();
            if (data && data.errors) setErrors(Object.assign(errors, data.errors));
          })
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }, [code])

  // TODO organize this code maybe into utils and some into different component, login to spotify as its own component with this code

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
      });
  }

  const handleTransfer = (e) => {
    e.preventDefault();

    const payload = { url };

    dispatch(playlistActions.getYoutubePlaylist(payload))
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) setErrors(Object.assign(errors, data.errors));
      })
  }

  return (
    <>
      <section className='banner'>
        <h2>Transfer playlists from Youtube to Spotify</h2>

        // TODO if user set button to show Logged in as  'user-pic' 'user-name'
        <button type='button' onClick={authenticate}>Log in to Spotify</button>

        <form onSubmit={handleTransfer}>
          {errors.url && (<p>{errors.url}</p>)}
            <input
              className="w-3/4"
              type="url"
              placeholder="Paste the link of the playlist you would like to transfer..."
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          <button type='submit' onClick={handleTransfer}>Transfer</button>
        </form>
      </section>


      {url && (
        <section>
          {youtube && (
              <section id='youtube-playlist'>
                <h3>{`Youtube Playlist - ${youtube.name}`}</h3>
                <ol>
                  {youtube.songs.map((title, idx) => <li key={idx}>{title}</li>)}
                </ol>
              </section>
          )}

          <section>

          </section>
          {spotify && (
            <section id='spotify-playlist'>
              <h3>Songs for Spotify Playlist</h3>
              <ol>
                {spotify.songs.map((title, idx) => <li key={idx}>${title}</li>)}
              </ol>
            </section>
          )}
        </section>
      )}
    </>
  )
}

export default Home;
