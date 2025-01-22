const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('Scribble Website API root endpoint');
});

router.get('/status', (req, res) => {
  res.send('Scribble API status endpoint');
});

module.exports = router;
