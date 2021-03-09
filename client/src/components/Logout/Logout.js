import React from 'react';
import auth from '../../utils/auth';
import api from '../../utils/apiClient';
import { useHistory } from "react-router-dom";
import { setIsAuthenticated } from '../../actions'
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

const Logout = () => {
  const history = useHistory();
  const dispatch = useDispatch();

  const handleClick = () => {
    removeToken();
    handleAuth();
  };

  const removeToken = () => {
    api.logout('accessToken');
  };

  const handleAuth = () => {
    dispatch(setIsAuthenticated(false));
    auth.logout(() => history.push('/'));
  };

  return (
    <div>
      <h2>Are you sure you want to log out?</h2>
      <Link to="/">
        <button className="confirm-btn">No</button>
      </Link>
      <button className="confirm-btn" onClick={() => handleClick()}>
        Yes
      </button>
    </div>
  );
};

export default Logout;