import { Input, InputGroup, InputLeftAddon } from '@chakra-ui/react';

const Home = () => {
  return (
    <main>
      <h2>Easily transfer playlists from Youtube to Spotify</h2>
      <InputGroup>
        <InputLeftAddon children='https://' />
        <Input placeholder='Paste the link of the playlist you would like to transfer...'/>
      </InputGroup>
    </main>
  )
}

export default Home;
