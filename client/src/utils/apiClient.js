const BASE_URL = 'http://localhost:3001';

function getUserData (userId) {
  return fetchRequest(`/user/${userId}`);
}

function saveForm ({userId, updateType, payload}) { // type must be 'fields' or 'logic', because server handles them differently (to avoid re-parsing logic text every time. Maybe I should change this)
  return fetchRequest('/form', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({userId, updateType, payload})
  });
}

function createUser ({email, password}) { // type must be 'fields' or 'logic', because server handles them differently (to avoid re-parsing logic text every time. Maybe I should change this)
  return fetchRequest('/user', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({email, password})
  });
}

function fetchRequest (path, options) {
  return fetch(BASE_URL + path, options)
    .then(res => res.status <= 400 ? res : Promise.reject())
    .then(res => res.status === 204 ? res : res.json())
    .catch(err => console.error(`Error fetching ${path}:`, err))
}

export default {
  createUser,
  getUserData,
  saveForm,
}

// SERVER ROUTER methods
// router.get('/user/:userId', user.getUserData);
// router.post('/user', user.createUser); // body format: {email: String, password: String}
// router.get('/form/:userId/:formId?', user.getFinalForm); // FIX: for now, not using formId (users only have one form)
// router.post('/form', user.updateForm); // body format: {userId: String, updateType: Enum {'fields', 'logic'}, payload: Enum {[field], 'logicText'}}