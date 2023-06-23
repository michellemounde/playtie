import { csrfFetch } from './csrf';

const SUBMIT_LINK = 'link/submitLink';

const submitLink = link => {
  return {
    type: SUBMIT_LINK,
    payload: link
  }
};


export const submit = link => async dispatch => {
  const { url } = link;

  const res = await csrfFetch('/api/links', {
    method: 'POST',
    // headers will be set by csrfFetch
    body: JSON.stringify({ url })
    });

  if (res.ok) {
    const data = await res.json();
    dispatch(submitLink(data.link));
    return res;
  }
}


const initialState = { url: null };

const linkReducer = (state = initialState, action) => {
  let nextState = Object.assign({}, state);

  switch(action.type) {
    case SUBMIT_LINK:
      nextState.url = action.payload;
      return nextState;
    default:
      return state;
  }
}

export default linkReducer;
