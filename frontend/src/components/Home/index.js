import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import * as playlistActions from '../../store/playlist';

import './Home.css';
import SpotifyLoginButton from '../SpotifyLoginButton';


const Home = () => {
  const dispatch = useDispatch();

  const [url, setUrl] = useState('');
  const [errors, setErrors] = useState({});

  const youtube = useSelector(state => state.playlist.youtube);
  const spotify = useSelector(state => state.playlist.spotify);

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

        <SpotifyLoginButton />

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
