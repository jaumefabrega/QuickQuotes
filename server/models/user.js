'use strict';

const { Schema, model} = require('./');


const userSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  form: {
    fields: {type: Array, default:[]},
    logicText: {type: String, default:''},
    scriptText: {type: String, default:''},
    settings: {
      title: {type: String, default:''},
      backgroundColor: {type: String, default:''},
      fieldsColor: {type: String, default:''}
    }
  },
});

const User = model('User', userSchema);

module.exports = User;