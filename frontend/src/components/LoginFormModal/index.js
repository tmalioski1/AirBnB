import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors([]);
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(
        async (res) => {
          const data = await res.json();
          if (data && data.errors) setErrors(data.errors);
        }
      );
  };

  const handleDemoUser = (e) => {
    setCredential('user1@user.io')
    setPassword('password2')
    return dispatch(sessionActions.login({ credential, password }))
    .then(closeModal)
  }

  return (
    <>
      <form className= "login-form" onSubmit={handleSubmit}>
      <h1 className= "login-form-header">Log In</h1>
        <ul>
          {errors.map((error, idx) => (
            <div className= "login-errors" key={idx}>{error}</div>
          ))}
        </ul>

          <input
            type="text"
            value={credential}
            placeholder= 'Username or Email'
            onChange={(e) => setCredential(e.target.value)}
            required
          />

          <input
            type="password"
            value={password}
            placeholder= 'Password'
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        <button className= 'login-button' type="submit">Log In</button>
        <button className= 'demo-user-button' onClick={handleDemoUser}>Demo User</button>
      </form>
    </>
  );
}

export default LoginFormModal;
