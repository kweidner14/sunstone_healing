const User = require('../models/user');
const Post = require('../models/post');

module.exports = {
  // GET / thanks
  getThanks(req, res, next) {
    res.render('offerings/thanks', {title: 'Thanks'})
  },

  getPurchase(req, res, next) {
    res.render('offerings/purchase', {title: 'Purchase'})
  }
}
