const SET_USER_PROFILE = 'spotify/setUserProfile';

const setUserProfile = userProfile => {
  return {
    type: SET_USER_PROFILE,
    payload: userProfile
  }
}

export const getUserProfile = (accessToken) => async dispatch => {
  const res = await fetch('https://api.spotify.com/v1/me', {
    headers: {
      Authorization: 'Bearer ' + accessToken
    }
  });

  if (res.ok) {
    const data = await res.json();
    dispatch(setUserProfile(data));
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
