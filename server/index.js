'use strict';

const express = require('express');
const app = express();

const cors = require('cors');
const router = require('./router');

const PORT = 3001;
const connection = require('./models');

app.use(cors());
app.use(express.json());
app.use(router);

(async function () {
  try {
    await connection;
    app.listen(PORT, () => console.log(`Server listening at http://localhost:${PORT}`));
  } catch (e) {
    console.error('Error while bootstrapping:', e); // eslint-disable-line no-console
  }
})();