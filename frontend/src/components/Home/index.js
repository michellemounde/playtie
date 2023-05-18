import { Editable, EditableInput, EditablePreview } from '@chakra-ui/react';

const Home = () => {
  return (
    <main>
      <h2>Easily transfer playlists from Youtube to Spotify</h2>
      <Editable>
        <EditablePreview />
        <EditableInput />
      </Editable>
    </main>
  )
}

export default Home;
