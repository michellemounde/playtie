import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import * as spotifyActions from '../../store/spotify';
import { authenticate, requestAccessToken, refreshAccessToken } from '../../utils/spotify-auth';

import './SpotifyLoginButton.css';

function SpotifyLoginButton() {
  const dispatch = useDispatch();

  const [error, setError] = useState('');

  const userProfile = useSelector((state) => state.spotify.userProfile);

  const urlParams = new URLSearchParams(window.location.search);
  const authCode = urlParams.get('code');
  const loginError = urlParams.get('error');

  const getProfile = async () => {
    const accessToken = localStorage.getItem('access_token');
    dispatch(spotifyActions.getUserProfile(accessToken));
  };

  useEffect(() => {
    if (userProfile) {
      const expiry = localStorage.getItem('expires_in');
      const interval = setInterval(() => {
        refreshAccessToken();
      }, expiry * 1000);

      return () => {
        clearInterval(interval);
      };
    }
    if (authCode) {
      requestAccessToken(authCode)
        .then(() => getProfile());
    } else {
      setError(loginError);
    }
  }, [userProfile, authCode, loginError, urlParams]);

  const handleLogin = async () => {
    await authenticate();
  };

  // TODO add spotify logout button in case user wants to log in to another account in the same session

  return (
    <>
      {error && (
        <p>
          Unable to Login to Spotify due to the following error:
          {error}
        </p>
      )}

      {!userProfile ?
        <button type="button" onClick={handleLogin}>Log in to Spotify</button> :
        (
          <button type="button">
            Logged in as
            <img src={userProfile.images[0].url} alt="Current user's profile icon" />
            {`${userProfile.display_name}`}
          </button>
        )}
    </>
  );
}

export default SpotifyLoginButton;
