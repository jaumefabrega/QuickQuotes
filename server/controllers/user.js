'use strict';

const Handlebars = require('handlebars');
const fs = require('fs');
const User = require('../models/user');
const { parseLogic } = require('../utils/formLogicParser');

function fakeParseLogic (text) { // For testing only
  return `This is the parsed script:\n\n${text}`;
}

exports.createUser = async (req, res) => {
  try {
    console.log(req.body);
    const { email, password } = req.body;
    const newUser = await User.create({email, password});
    res.status(201);
    res.send(newUser);
  } catch (error) {
    console.log('error', error); // eslint-disable-line no-console
    res.sendStatus(500);
  }
};

exports.getUserData = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
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
    console.log('queried final form');
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
    const JSResult = JSTemplate({htmlToWrite, scriptText}, {noEscape: true});

    res.status(200);
    // res.setHeader('content-type', 'applicaton/json');
    res.send(JSResult);
  } catch (error) {
    console.log('error', error); // eslint-disable-line no-console
    res.sendStatus(500);
  }
};

// body format: {userId: String, updateType: Enum {'fields', 'logic'}, payload: Enum {[field], 'logicText'}}
exports.updateForm = async (req, res) => {
  try {
    const { userId, updateType, payload } = req.body;
    let user;
    if (updateType === 'fields') {
      user = await User.findByIdAndUpdate(userId, {$set: {'form.fields': payload.fields, 'form.settings': payload.settings}}, {new: true});
    } else if (updateType === 'logic') {
      const newScriptText = parseLogic(payload);
      user = await User.findByIdAndUpdate(userId, {$set: {'form.logicText': payload, 'form.scriptText': newScriptText}}, {new: true});
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
    const { userId, analyticType, payload } = req.body;
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
