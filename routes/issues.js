const express = require('express');
const formatDate = require('../utils/formatDate');

const router = express.Router();
const { getIssues } = require('../utils/github');

router.get('/issues', async (req, res) => {
  try {
    const issuesByAssignee = await getIssues();
    res.render('issues', { issuesByAssignee, formatDate });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching issues:', error);
    res.status(500).send('An error occurred while fetching issues.');
  }
});

module.exports = router;
