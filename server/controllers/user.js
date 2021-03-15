'use strict';

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Handlebars = require('handlebars');
const fs = require('fs');
const User = require('../models/user');
const { parseLogic } = require('../utils/formLogicParser');
const SECRET_KEY = process.env.SECRET_KEY || 'dumbKey';

function fakeParseLogic (text) { // For testing only
  return `This is the parsed script:\n\n${text}`;
}

exports.createUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email });
  if (user)
    return res
      .status(409)
      .send({ error: '409', message: 'User already exists' });
  try {
    if (password === '') throw new Error();
    const hash = await bcrypt.hash(password, 10);
    const { _id } = await User.create({email, password: hash});
    const accessToken = jwt.sign({ _id}, SECRET_KEY);
    res.status(201).send({ accessToken});
  } catch (error) {
    console.log('error', error); // eslint-disable-line no-console
    res.status(400).send({ error, message: 'Could not create user' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email });
    const validatedPass = await bcrypt.compare(password, user.password);
    if (!validatedPass) throw new Error();
    const accessToken = jwt.sign({ _id: user._id }, SECRET_KEY);
    res.status(200).send({ accessToken });
  } catch (error) {
    res
      .status(401)
      .send({ error: '401', message: 'Username or password is incorrect' });
  }
};

// TODO
exports.logout = (req, res) => {
  // delete the token client side upon logout.
  // you would invalidate the token here.
};

exports.getUserData = async (req, res) => {
  try {
    const user = req.user;
    res.status(200);
    res.send(user);
  } catch (error) {
    console.log('error', error); // eslint-disable-line no-console
    res.sendStatus(500);
  }
};

exports.getFinalForm = async (req, res) => {
  try {
    const { userId, formId } = req.params;
    const user = await User.findByIdAndUpdate(userId, {$inc : {'analytics.visits' : 1}}, {new: true}); // I am not sure that the visit increment should be done directly here...
    const { scriptText, fields, settings } = user.form;
    const safeFields = fields.map(field => {
      return {...field, safeName: 'QQ_'+field.name.replace(/ /g, '_').toLowerCase()}; // TODO: this should actually be a function of the util formLogicParser
    });

    Handlebars.registerHelper('isNotTextVariable', (variable) => variable.type !== 'text');
    Handlebars.registerHelper('isNotDropdownVariable', (variable) => variable.type !== 'dropdown');

    const htmlSource = fs.readFileSync(__dirname + '/../views/form.html', 'utf8');
    const htmlTemplate = Handlebars.compile(htmlSource);
    const htmlToWrite = htmlTemplate({safeFields, settings}, {noEscape: true});

    const JSSource = fs.readFileSync(__dirname + '/../views/form.js', 'utf8');
    const JSTemplate = Handlebars.compile(JSSource);
    const JSResult = JSTemplate({htmlToWrite, scriptText, userId}, {noEscape: true});

    res.status(200);
    res.send(JSResult);
  } catch (error) {
    res.sendStatus(500);
  }
};

// body format: {updateType: Enum {'fields', 'logic'}, payload: Enum {[field], 'logicText'}}
exports.updateForm = async (req, res) => {
  try {
    const { updateType, payload } = req.body;
    const user = req.user;
    if (updateType === 'fields') {
      user.form.fields = payload.fields;
      user.form.settings = payload.settings;
      await user.save();
    } else if (updateType === 'logic') {
      const newScriptText = parseLogic(payload);
      user.form.logicText = payload;
      user.form.scriptText = newScriptText;
      await user.save();
    }
    res.status(201);
    res.send(user);
  } catch (error) {
    console.log('error', error); // eslint-disable-line no-console
    res.sendStatus(500);
  }
};


// body format: {userId: String, analyticType: Enum {'calculation', 'lead'}, payload: Enum {{analytic object}, {lead object}}
exports.postAnalytics = async (req, res) => {
  try {
    let { userId, analyticType, payload } = req.query;
    payload = JSON.parse(payload);
    let user;
    if (analyticType === 'lead') {
      user = await User.findByIdAndUpdate(userId, {$push: {'analytics.leads': {...payload, timestamp: new Date()}}}, {new: true});
    }
    res.status(201);
    res.send(user);
  } catch (error) {
    console.log('error', error); // eslint-disable-line no-console
    res.sendStatus(500);
  }
};
