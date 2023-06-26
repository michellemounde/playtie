import { csrfFetch } from './csrf';

const GET_SONG_TITLES = 'songs/getSongTitles';
const FIND_SONGS = 'songs/findSongs';

const getSongTitles = titles => {
  return {
    type: GET_SONG_TITLES,
    payload: titles
  }
};


export const currentSongTitles = link => async dispatch => {
  const { url } = link;

  const res = await csrfFetch('/api/songs', {
    method: 'POST',
    // headers will be set by csrfFetch
    body: JSON.stringify({ url })
    });

  if (res.ok) {
    const data = await res.json();
    dispatch(getSongTitles(data.songTitles));
    return res;
  }
}

export const targetSongs = songTitles => async dispatch => {

}


const initialState = { songs: null };

const songReducer = (state = initialState, action) => {
  let nextState = Object.assign({}, state);

  switch(action.type) {
    case GET_SONG_TITLES:
      nextState.songTitles = action.payload;
      return nextState;
    default:
      return state;
  }
}

export default songReducer;
