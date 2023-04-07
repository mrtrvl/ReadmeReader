const express = require('express');

const router = express.Router();
const { getCommits } = require('../utils/github');
const formatDate = require('../utils/formatDate');

router.get('/commits', async (req, res) => {
  try {
    const commits = await getCommits();
    // eslint-disable-next-line max-len
    const averageCommitCount = commits.reduce((total, commitGroup) => total + commitGroup.commits.length, 0) / commits.length;
    res.render('commits', { commits, formatDate, averageCommitCount });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching commits:', error);
    res.status(500).send('An error occurred while fetching commits.');
  }
});

module.exports = router;
