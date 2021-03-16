import React, { useState } from 'react';
import auth from '../../utils/auth';
import api from '../../utils/apiClient';
import { useHistory } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { setIsAuthenticated } from '../../actions'
import './Login.css'

const initialState = {
  email: '',
  password: '',
};

const Login = () => {
  const [state, setState] = useState(initialState);
  const history = useHistory();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    // Check the session branch to see how to handle redirects
    e.preventDefault();
    const { email, password } = state;
    const user = { email, password };
    const res = await api.login(user);

    if (res.error) {
      alert(`${res.message}`);
      setState(initialState);
    } else {
      const { accessToken } = res;
      localStorage.setItem('accessToken', accessToken);
      dispatch(setIsAuthenticated(true));
      auth.login(() => history.push('/'));
    }
  };

  const validateForm = () => {
    return !state.email || !state.password;
  };

  return (
    <div className="login">
      <img id="logo" src="/assets/images/logo.png" alt="logo" />
      <h3 className="title">Login</h3>
      <form className="form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="email"
          name="email"
          value={state.email}
          onChange={handleChange}
          autoComplete="off"
        />
        <input
          type="password"
          placeholder="password"
          name="password"
          value={state.password}
          onChange={handleChange}
          autoComplete="off"
        />
        <input type="submit" value="Login" className="form-submit button primary" disabled={validateForm()} />
      </form>
    </div>
  );
};

export default Login;