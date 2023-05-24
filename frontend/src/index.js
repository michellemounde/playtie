import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import { ChakraProvider } from '@chakra-ui/react';

import App from './App';
import { ModalProvider, Modal } from './context/Modal';

import store from './store';
import { restoreCsrf, csrfFetch } from './store/csrf';
import * as sessionActions from './store/session';
import * as linkActions from './store/links';

import './index.css';

if (process.env.NODE_ENV !== 'production') {
  restoreCsrf();

  window.csrfFetch = csrfFetch;
  window.store = store;
  window.sessionActions = sessionActions;
  window.linkActions = linkActions;
}

function Root() {
  return (
    <ChakraProvider>
      <ModalProvider>
        <Provider store={store}>
          <BrowserRouter>
            <App />
            <Modal />
          </BrowserRouter>
        </Provider>
      </ModalProvider>
    </ChakraProvider>
  );
}

const root = createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
