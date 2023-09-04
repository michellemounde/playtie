import { csrfFetch } from './csrf';

const SET_USER_PROFILE = 'spotify/setUserProfile';
const REMOVE_USER_PROFILE = 'spotify/removeUserProfile';

// TODO create action for SET_USER

const setUserProfile = userProfile => {
  return {
    type: SET_USER_PROFILE,
    payload: userProfile
  }
}

// TODO set user action by getting the user profile
export const getUserProfile = () => async dispatch => {
  let accessToken = localStorage.getItem('access_token');

  const res = await fetch('https://api.spotify.com/v1/me', {
    headers: {
      Authorization: 'Bearer ' + accessToken
    }
  });

  if (res.ok) {
    const data = await res.json();
    //TODO make sure we are accessing the userProfile correctly before setting it
    dispatch(setUserProfile(data.userProfile));
    return res;
  }
}

const initialState = {};

const spotifyReducer = (state = initialState, action) => {
  let nextState = Object.assign({}, state);

  switch(action.type) {
    case SET_USER_PROFILE:
      nextState.userProfile = action.payload;
      return nextState;
    default:
      return state;
  }
}

export default spotifyReducer;
