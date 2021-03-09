'use strict';

const router = require('express').Router();
const user = require('./controllers/user');
const authMiddleware = require('./middlewares/auth');

router.post('/register', user.createUser); // body format: {email: String, password: String}
router.post('/login', user.login);
router.post('/logout', authMiddleware, user.logout);

router.get('/user', authMiddleware, user.getUserData);
router.get('/form/:userId/:formId?', user.getFinalForm); // FIX: for now, not using formId (users only have one form)
router.post('/form', authMiddleware, user.updateForm); // body format: {updateType: Enum {'fields', 'logic'}, payload: Enum {[field], 'logicText'}
router.post('/analytics', user.postAnalytics); // body format: {userId: String, analyticType: Enum {'lead'}, payload: Enum {{lead object}}
module.exports = router;