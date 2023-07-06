import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';

import * as playlistActions from '../../store/playlist';
import * as authActions from '../../store/auth';

import { Input, InputGroup, InputLeftAddon, FormControl, FormErrorMessage, Button} from '@chakra-ui/react';


const Home = () => {
  const dispatch = useDispatch();

  const [url, setUrl] = useState('');
  const [errors, setErrors] = useState({});

  const youtube = useSelector(state => state.playlist.youtube);
  const spotify = useSelector(state => state.playlist.spotify);

  const { code, state, error } = useParams();

  useEffect(() => {
    if (error) {
      setErrors(Object.assign(errors, {authError: error}));
    } else {
      const payload = { code, state };
      dispatch(authActions.getAccessToken(payload))
        .catch(async (res) => {
          const data = await res.json();
          if (data && data.errors) setErrors(Object.assign(errors, data.errors));
        })
    }
  }, [code, state, error])

  const authenticate = async() => {
    dispatch(authActions.getUserAuth())
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) setErrors(Object.assign(errors, data.errors));
      })
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
      <h2>Transfer playlists from Youtube to Spotify</h2>

      <section>
        <p>Click the button below to login to Spotify</p>
        <Button type='button' onClick={authenticate}>Log in to Spotify</Button>
      </section>

      <form onSubmit={handleTransfer}>
        <FormControl isRequired>
          <InputGroup>
            <InputLeftAddon children='Link:' />
            <Input
              type='url'
              placeholder='Paste the link of the playlist you would like to transfer...'
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}/>
          </InputGroup>
          {errors.url && (<FormErrorMessage>{errors.url}</FormErrorMessage>)}
        </FormControl>
        <Button type='submit' onClick={handleTransfer}>Transfer</Button>
      </form>

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
