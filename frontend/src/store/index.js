import { configureStore } from '@reduxjs/toolkit';

import sessionReducer from './session';
import playlistReducer from './playlist';
import spotifyReducer from './spotify';

const rootReducer = ({
  session: sessionReducer,
  playlist: playlistReducer,
  spotify: spotifyReducer,
});

const preloadedState = {};

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => {
    if (process.env.NODE_ENV !== 'production') {
      const logger = require('redux-logger').default;
      return getDefaultMiddleware().concat(logger);
    }
    return getDefaultMiddleware();
  },
  preloadedState,
});

export default store;
