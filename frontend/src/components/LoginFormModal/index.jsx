import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import * as sessionActions from '../../store/session';
import { useModal } from '../../context/Modal';

import './LoginForm.css';

function LoginFormModal() {
  const dispatch = useDispatch();

  const [credential, setCredential] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      credential,
      password,
    };

    return dispatch(sessionActions.login(payload))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) setErrors(data.errors);
      });
  };

  return (
    <>
      <h2>Log In</h2>
      <form onSubmit={handleSubmit}>
        {errors.credential && <p>{errors.credential}</p>}
        <label htmlFor="credential">
          Username or Email
          <input
            id="credential"
            type="text"
            placeholder="Enter username or email"
            required
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
          />
        </label>
        <label htmlFor="login-password">
          Password
          <input
            id="login-password"
            type="text"
            placeholder="Enter password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <button type="submit">Log In</button>
      </form>
    </>

  );
}

export default LoginFormModal;
