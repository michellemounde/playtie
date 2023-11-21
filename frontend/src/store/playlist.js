import { csrfFetch } from './csrf';

const GET_PLAYLIST = 'playlist/getPlaylist';
const SET_PLAYLIST = 'playlist/setPlaylist';

const getPlaylist = (playlist) => ({
  type: GET_PLAYLIST,
  payload: playlist,
});

const setPlaylist = (playlist) => ({
  type: SET_PLAYLIST,
  payload: playlist,
});

export const getYoutubePlaylist = (link) => async (dispatch) => {
  const { url } = link;

  const res = await csrfFetch('/api/playlist', {
    method: 'POST',
    // headers will be set by csrfFetch
    body: JSON.stringify({ url }),
  });

  if (res.ok) {
    const data = await res.json();
    dispatch(getPlaylist(data.playlist));
    return res;
  }
};

export const createSpotifyPlaylist = (songs) => async (dispatch) => {
  // TODO Fix this to work - Promise.all() because it's several songs
  const spotifySongs = songs.map(async (song) => {
    await csrfFetch(`Spotify song search api here`);
    // Get song and add it to playlist
  });

  const res = Promise.all(spotifySongs);

  if (res.ok) {
    const data = await res.json();
    dispatch(setPlaylist(data.playlist));
    return res;
  }
};

const initialState = {
  youtube: null,
  spotify: null,
};

const playlistReducer = (state = initialState, action) => {
  const nextState = { ...state };

  switch (action.type) {
    case GET_PLAYLIST:
      nextState.youtube = action.payload;
      return nextState;
    default:
      return state;
  }
};

export default playlistReducer;
