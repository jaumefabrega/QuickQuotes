'use strict';
const mongoose = require('mongoose');

const dbName = process.env.DB_NAME || 'quick_quotes';
const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = process.env.DB_PORT || '27017';

mongoose.connect(`mongodb://${dbHost}:${dbPort}/${dbName}`, { useNewUrlParser: true, useUnifiedTopology: true }); // TODO: dig deeper into useFindAndModify: false

module.exports = mongoose;