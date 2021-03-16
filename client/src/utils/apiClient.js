const BASE_URL = 'http://localhost:3001';

function getUserData () {
  return fetch(`${BASE_URL}/user`, {
    method: 'GET',
    credentials: 'include',
    mode: 'cors',
    headers: { 'Content-Type': 'application/json',
      authorization: `Bearer ${localStorage.getItem('accessToken')}`
    },
  })
    .then(sleeper(1000)) // to test loading icon
    .then((res) => res.json())
    .catch((err) => {
      console.log(err);
      throw new Error('apiClient error when fetching user data');
    });
}

function saveForm ({updateType, payload}) { // type must be 'fields' or 'logic', because server handles them differently (to avoid re-parsing logic text every time. Maybe I should change this)
  return fetch(`${BASE_URL}/form`, {
    method: 'POST',
    credentials: 'include',
    mode: 'cors',
    headers: { 'Content-Type': 'application/json',
      authorization: `Bearer ${localStorage.getItem('accessToken')}`
    },
    body: JSON.stringify({updateType, payload}),
  })
    .then((res) => res.json())
    .catch((err) => console.log(err));

}

function register (user){
  return fetch(`${BASE_URL}/register`, {
    method: 'POST',
    credentials: 'include',
    mode: 'cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  })
    .then((res) => res.json())
    .catch((err) => console.log(err));
};

function login (user) {
  return fetch(`${BASE_URL}/login`, {
    method: 'POST',
    credentials: 'include',
    mode: 'cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  })
    .then((res) => res.json())
    .catch((err) => console.log(err));
};

function logout (tokenName) {
  // delete token from local storage here
  localStorage.removeItem(tokenName);
  // the following request should invalidate the token
  // return fetch(`${BASE_URL}/logout`, {
  //   method: 'POST',
  //   credentials: 'include',
  //   mode: 'cors',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     Authorization: `Bearer ${tokenName}`,
  //   },
  // })
  //   .then((res) => res.json())
  //   .catch((err) => console.log(err));
};


// Helper function for testing (loading icons, etc)
function sleeper(ms) {
  return function(x) {
    return new Promise(resolve => setTimeout(() => resolve(x), ms));
  };
}

export default {
  getUserData,
  saveForm,
  register,
  login,
  logout
}