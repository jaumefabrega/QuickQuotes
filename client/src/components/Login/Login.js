import React, { useState } from 'react';
import auth from '../../utils/auth';
import api from '../../utils/apiClient';
import { useHistory } from "react-router-dom";
import { setIsAuthenticated } from '../../actions'

const initialState = {
  email: '',
  password: '',
};

const Login = () => {
  const [state, setState] = useState(initialState);
  const history = useHistory();

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
      console.log('access token is ', accessToken);
      setIsAuthenticated(true);
      auth.login(() => history.push('/'));
    }
  };

  const validateForm = () => {
    return !state.email || !state.password;
  };

  return (
    <div>
      <h2>Login</h2>
      <form className="form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="name@mail.com"
          name="email"
          value={state.email}
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="supersecretthingy"
          name="password"
          value={state.password}
          onChange={handleChange}
        />
        <button className="form-submit" type="submit" disabled={validateForm()}>
          &nbsp;Login&nbsp;
        </button>
      </form>
    </div>
  );
};

export default Login;