import { csrfFetch } from './csrf';

const GET_AUTH = 'auth/getAuth';
const GET_TOKEN = 'auth/getToken';
const REFRESH_TOKEN = 'auth/refreshToken';

const getAuth = () => {
  return {
    type: GET_AUTH
  }
}

const getToken = () => {
  return {
    type: GET_TOKEN
  }
};

const refreshToken = () => {
  return {
    type: REFRESH_TOKEN
  }
};

export const getUserAuth = () => async dispatch => {
  const res = await csrfFetch('/api/auth/');

  if (res.ok) {
    return res;
  }
}

export const getAccessToken = () => async dispatch => {
  const res = await csrfFetch('/api/auth/', {
    method: 'POST'
  });

  if (res.ok) {
    return res;
  }
}

export const refreshAccessToken = () => async dispatch => {
  const res = await csrfFetch('/api/auth/refresh-token');

  if (res.ok) {
    return res;
  }
}


const initialState = {};

const authReducer = (state = initialState, action) => {
  let nextState = Object.assign({}, state);

  switch(action.type) {
    case GET_AUTH:
      return nextState;
    case GET_TOKEN:
      return nextState;
    case REFRESH_TOKEN:
      return nextState;
    default:
      return state;
  }
}

export default authReducer;
