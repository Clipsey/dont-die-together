const express = require('express');
const router = express.Router();

router.get('/:fileName', (req, res) => {
  console.log(`sending file: ${req.params.fileName}`);
  res.sendFile(`${__dirname}/audioFiles/${req.params.fileName}`);
});

module.exports = router;