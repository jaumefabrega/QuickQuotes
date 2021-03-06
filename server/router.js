'use strict';

const router = require('express').Router();
const user = require('./controllers/user');

router.get('/user/:userId', user.getUserData);
router.post('/user', user.createUser); // body format: {email: String, password: String}
router.get('/form/:userId/:formId?', user.getFinalForm); // For now, not using formId (users only have one form)
router.post('/form', user.updateForm); // body format: {userId: String, updateType: Enum {'fields', 'logic'}, payload: Enum {[field], 'logicText'}}

module.exports = router;