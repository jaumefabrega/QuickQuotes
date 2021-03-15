'use strict';
require('dotenv').config();

const express = require('express');
const app = express();

const cors = require('cors');
const router = require('./router');

const SERVER_PORT = process.env.SERVER_PORT || 3001;
const CLIENT_PORT = process.env.CLIENT_PORT || 3000;
const CLIENT_HOST = process.env.CLIENT_HOST || 'localhost';
const connection = require('./models');

const corsConfig = {
  origin: `http://${CLIENT_HOST}:${CLIENT_PORT}`,
  credentials: true,
};

app.use(cors(corsConfig));
app.use(express.json());
app.use(router);

(async function () {
  try {
    await connection;
    app.listen(SERVER_PORT, () => console.log(`Server listening at http://localhost:${SERVER_PORT}`));
  } catch (error) {
    console.error('Error while bootstrapping:', error); // eslint-disable-line no-console
  }
})();