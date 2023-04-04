const express = require('express');

const router = express.Router();
const { getReadmes } = require('../utils/github');

let readmesCache = null;
let cacheTimestamp = null;
const cacheDuration = 5 * 60 * 1000; // 5 minutes in milliseconds

router.get('/readmes', async (req, res) => {
  const now = Date.now();

  if (readmesCache && cacheTimestamp && now - cacheTimestamp < cacheDuration) {
    res.render('readmes', { readmes: readmesCache });
  } else {
    try {
      const readmes = await getReadmes();
      readmesCache = readmes;
      cacheTimestamp = now;
      res.render('readmes', { readmes });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching readmes:', error);
      res.status(500).send('An error occurred while fetching readmes.');
    }
  }
});

module.exports = router;
