var mongoose = require('mongoose');
var Item = mongoose.model('User', require('../models/user'));

module.exports.controller = function(app) {
	app.get('/signup', function(req, res) {
      // any logic goes here
      res.render('users/signup')
  	});

  	app.get('/login', function(req, res) {
      // any logic goes here
      res.render('users/login')
  	});
}

