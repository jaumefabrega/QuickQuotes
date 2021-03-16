import React from 'react';
import auth from '../../utils/auth';
import api from '../../utils/apiClient';
import { useHistory } from "react-router-dom";
import { setIsAuthenticated } from '../../actions'
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import './Logout.css'

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
      <p onClick={() => handleClick()} className="tertiary button">Logout</p>
    </div>
  );
};

export default Logout;