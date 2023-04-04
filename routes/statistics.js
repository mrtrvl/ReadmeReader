const express = require('express');

const router = express.Router();
const { getStatistics } = require('../utils/github'); // Import the new function
const formatDate = require('../utils/formatDate');

router.get('/statistics', async (req, res) => {
  try {
    const statistics = await getStatistics(); // Use the new function
    res.render('statistics', { statistics, formatDate });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).send('An error occurred while fetching statistics.');
  }
});

module.exports = router;
