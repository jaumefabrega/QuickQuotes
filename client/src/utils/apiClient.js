const BASE_URL = 'http://localhost:3001';

function getUserData () {
  // return fetchRequest('/user', {
  //   method: 'GET',
  //   credentials: 'include',
  //   mode: 'cors',
  //   headers: {'Content-Type': 'application/json'},
  // })
  //   // .then((res) => res.json())


  return fetch(`${BASE_URL}/user`, {
    method: 'GET',
    credentials: 'include',
    mode: 'cors',
    headers: { 'Content-Type': 'application/json',
      authorization: `Bearer ${localStorage.getItem('accessToken')}`
    },
  })
    .then((res) => res.json())
    .catch((err) => console.log(err));



  //.then(sleeper(2000));
}

function saveForm ({updateType, payload}) { // type must be 'fields' or 'logic', because server handles them differently (to avoid re-parsing logic text every time. Maybe I should change this)
  // return fetchRequest('/form', {
  //   method: 'POST',
  //   credentials: 'include',
  //   mode: 'cors',
  //   headers: {'Content-Type': 'application/json'},
  //   body: JSON.stringify({userId, updateType, payload})
  // })
  //   .then((res) => res.json());

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

function fetchRequest (path, options) {
  return fetch(BASE_URL + path, options)
  .then(res => res.status <= 400 ? res : Promise.reject())
  // .then(res => res.status === 204 ? res : res.json())
  .catch(err => console.error(`Error fetching ${path}:`, err))
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