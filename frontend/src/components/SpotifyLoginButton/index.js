import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import * as spotifyActions from "../../store/spotify";
import { authenticate, requestAccessToken, refreshAccessToken } from "../../utils/spotify-auth";

import "./SpotifyLoginButton.css";

const SpotifyLoginButton = ({ authCode, loginError}) => {
  const dispatch = useDispatch();

  const [error, setError] = useState("");

  const userProfile = useSelector(state => state.spotify.userProfile)

  useEffect(() => {
    if (userProfile) {
      const interval = setInterval(() =>{
        refreshAccessToken()
      }, 60 * 60 * 1000)

      return () => {
        clearInterval(interval);
      };
    } else {
      if (authCode) {
        requestAccessToken(authCode)
          .then(() => getProfile())
      } else {
        setError(loginError)
      }
    }



  }, [userProfile, authCode, loginError])

  const getProfile = async () => {
    const accessToken = localStorage.getItem("access_token")
    dispatch(spotifyActions.getUserProfile(accessToken))
  }

  const handleLogin = async () => {
    await authenticate();
  }

  return (
    <>
      {error && <p>Unable to Login to Spotify due to the following error: {error}</p>}

      {!userProfile
        ?
          <button type="button" onClick={handleLogin}>Log in to Spotify</button>
        :
          <button type="button">
            Logged in as
            <img src={userProfile.images[0].url} alt="Current user's profile icon"/>
            {`${userProfile.display_name}`}
          </button>
      }
    </>
  )
}

export default SpotifyLoginButton;
