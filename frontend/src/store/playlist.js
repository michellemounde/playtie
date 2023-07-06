import { csrfFetch } from './csrf';

const GET_PLAYLIST = 'playlist/getPlaylist';
const CREATE_PLAYLIST = 'playlist/createPlaylist'

const getPlaylist = playlist => {
  return {
    type: GET_PLAYLIST,
    payload: playlist
  }
};


export const getYoutubePlaylist = link => async dispatch => {
  const { url } = link;

  const res = await csrfFetch('/api/playlist', {
    method: 'POST',
    // headers will be set by csrfFetch
    body: JSON.stringify({ url })
    });

  if (res.ok) {
    const data = await res.json();
    dispatch(getPlaylist(data.playlist));
    return res;
  }
}


const initialState = {
  youtube: null,
  spotify: null
};


const playlistReducer = (state = initialState, action) => {
  let nextState = Object.assign({}, state);

  switch(action.type) {
    case GET_PLAYLIST:
      nextState.youtube = action.payload;
      return nextState;
    default:
      return state;
  }
}

export default playlistReducer;
