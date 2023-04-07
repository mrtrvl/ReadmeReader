const express = require('express');

const router = express.Router();
const { getCommits } = require('../utils/github');
const formatDate = require('../utils/formatDate');

router.get('/statistics', async (req, res) => {
  try {
    const commitGroups = await getCommits();
    res.render('statistics', { commitGroups, formatDate });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).send('An error occurred while fetching statistics.');
  }
});

module.exports = router;
