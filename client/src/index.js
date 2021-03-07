import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createStore } from "redux";
import { Provider } from "react-redux";
import reducer from "./reducer";

import {
  BrowserRouter as Router,
} from "react-router-dom"

import api from './utils/apiClient';

api.getUserData('604358dd2b586d1e800fb8fd')
  .then( res => {
    console.log(res);
    const store = createStore(reducer, res);
    ReactDOM.render(
      <React.StrictMode>
        <Provider store={store}>

        <Router>
          <App />
        </Router>

        </Provider>
      </React.StrictMode>,
      document.getElementById('root')
    );
  })
  .catch(error => console.log(error))



// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
