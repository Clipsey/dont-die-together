const express = require('express');
const router = express.Router();

router.get('/:fileName', (req, res) => {
  // Tweet.find()
  //   .sort({ date: -1 })
  //   .then(tweets => res.json(tweets))
  //   .catch(err => res.status(404).json({ notweetsfound: 'No tweets found' }));
  console.log(req.params);
  res.sendFile(`${__dirname}/audioFiles/${req.params.fileName}`);
});

module.exports = router;