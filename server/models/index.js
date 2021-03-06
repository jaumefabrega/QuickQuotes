'use strict';
const mongoose = require('mongoose');

const dbName = 'quick_quotes';

mongoose.connect(`mongodb://localhost:27017/${dbName}`, { useNewUrlParser: true, useUnifiedTopology: true }); // TODO: dig deeper into useFindAndModify: false

module.exports = mongoose;