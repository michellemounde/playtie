import { useState } from 'react';
import { useDispatch } from 'react-redux';

import * as linkActions from '../../store/links';

import { Input, InputGroup, InputLeftAddon, FormControl, FormErrorMessage, Button } from '@chakra-ui/react';

const Home = () => {

  const dispatch = useDispatch();

  const [url, setUrl] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = { url };
    return dispatch(linkActions.submit(payload))
  }

  return (
    <main>
      <h2>Easily transfer playlists from Youtube to Spotify</h2>

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
            <FormErrorMessage>Link is required</FormErrorMessage>
          </InputGroup>

        </FormControl>
        <Button>Submit</Button>
      </form>
    </main>
  )
}

export default Home;
