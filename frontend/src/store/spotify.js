import { csrfFetch } from './csrf';

const SET_USER = 'spotify/setUser';
const REMOVE_USER = 'spotify/removeUser';


const initialState = {};

const spotifyReducer = (state = initialState, action) => {
  let nextState = Object.assign({}, state);

  switch(action.type) {
    default:
      return state;
  }
}

export default spotifyReducer;
