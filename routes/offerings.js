const express = require('express');
const router = express.Router();
const {
  asyncErrorHandler,
} = require('../middleware');
const {
  getThanks,
    getPurchase,
} = require('../controllers/offerings');

router.get('/', function(req, res, next) {
  res.render('offerings', { title: 'Services Page'});
});

/* GET /thanks */
router.get('/thanks', getThanks);


router.get('/purchase', getPurchase);

module.exports = router;