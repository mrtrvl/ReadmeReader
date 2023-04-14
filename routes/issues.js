const express = require('express');

const router = express.Router();
const { getIssues } = require('../utils/github');

router.get('/issues', async (req, res) => {
  try {
    const issues = await getIssues();
    console.log(issues);
    res.render('issues', { issues });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching issues:', error);
    res.status(500).send('An error occurred while fetching issues.');
  }
});

module.exports = router;
