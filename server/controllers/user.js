'use strict';

const User = require('../models/user');

function fakeParseLogic (text) {
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
    console.log(req.params);
    console.log('looking for user', userId);
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
    const user = await User.findById(userId);
    // TODO: render template with fields and script
    res.status(200);
    res.send(user.form);
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
      user = await User.findByIdAndUpdate(userId, {$set: {'form.fields': payload}}, {new: true});
    } else if (updateType === 'logic') {
      const newScriptText = fakeParseLogic(payload);
      user = await User.findByIdAndUpdate(userId, {$set: {'form.logicText': payload, 'form.scriptText': newScriptText}}, {new: true});
    }
    res.status(201);
    res.send(user);
  } catch (error) {
    console.log('error', error); // eslint-disable-line no-console
    res.sendStatus(500);
  }
};