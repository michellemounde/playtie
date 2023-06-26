import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import * as songActions from '../../store/songs';

import { Input, InputGroup, InputLeftAddon, FormControl, FormErrorMessage, Button, Spinner } from '@chakra-ui/react';

const { spotifyToken } = require('../../utils/spotify-api-token');
const { timezoneCityCountry } = require('../../utils/timezone-city-country');

const Home = () => {

  const dispatch = useDispatch();

  const [url, setUrl] = useState('');
  const songTitles = useSelector(state => state.songTitles);
  const songs = useSelector(state => state.songs);
  const [errors, setErrors] = useState({});

  let currentPlatform, targetPlatform;

  if (url) {
    if (url.includes('www.youtube.com')) {
    currentPlatform = 'Youtube';
    targetPlatform = 'Spotify';
    } else {
      currentPlatform = 'Spotify';
      targetPlatform = 'Youtube';
    }
  }

  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  console.log('Timezone', userTimezone)
  const region = userTimezone.split('/')
  const userCity = region[region.length - 1];
  console.log('userCity', userCity)
  const userCountry = timezoneCityCountry[userCity];
  console.log('userCountry', userCountry)

  // useEffect(() => {
  //   // Find song titles in target platform
  //   if (targetPlatform === 'Spotify') {
  //     songLinks = songTitles.forEach(async songTitle => {
  //       await fetch(`https://api.spotify.com/v1/search?q=${songTitle}&type=track&market=${userCountry}limit=10`,{
  //         method: 'GET',
  //         headers: {
  //           'Authorization': `${spotifyToken}`
  //         }
  //       })
  //     })
  //   } else {

  //   }
  // }, [songTitles])

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = { url };

    return dispatch(songActions.currentSongTitles(payload))
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) setErrors(data.errors)
      })
  }




  return (
    <>
      <h2>Easily transfer playlists between Youtube and Spotify</h2>

      <form onSubmit={handleSubmit}>
        <FormControl isRequired>
          <InputGroup>
            <InputLeftAddon children='Link:' />
            <Input
              type='url'
              placeholder='Paste the link of the playlist you would like to transfer...'
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}/>
            {errors.link && (
              <FormErrorMessage>Link is required.</FormErrorMessage>
            )}
          </InputGroup>

        </FormControl>
        <Button type='submit'>Submit</Button>
      </form>

      {url && (
        <section>
          <section id='current-platform'>
            <h3>{`${currentPlatform}`} Playlist</h3>
            <h4>Current songs</h4>
            <ol>
              <li></li>
            </ol>
          </section>

          {songTitles && (<Spinner />)}

          {songs && (
            <section id='target-platform'>
              <h3>{`${targetPlatform}`} Playlist</h3>
              <h4>Songs found</h4>
              <ol>
                <li> </li>
              </ol>
              <h4>Songs not found</h4>
              <p>The following songs could not be found on {`${targetPlatform}`}:</p>
              <ol>
                <li></li>
              </ol>

              <section>
                <h4>Transfer Playlist</h4>
                <p>Click the button below to login and transfer the found songs to a {`${targetPlatform}`} playlist</p>
                <Button type='button'>Transfer</Button>
              </section>
            </section>
          )}
        </section>
      )}
    </>
  )
}

export default Home;
