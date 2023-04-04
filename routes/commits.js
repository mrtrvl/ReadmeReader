const express = require('express');

const router = express.Router();
const { getCommits } = require('../utils/github');
const formatDate = require('../utils/formatDate');

router.get('/commits', async (req, res) => {
  try {
    const commits = await getCommits();
    res.render('commits', { commits, formatDate });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching commits:', error);
    res.status(500).send('An error occurred while fetching commits.');
  }
});

module.exports = router;
