var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/anime', function(req, res, next) {

});

router.get('/manga', function(req, res, next) {

});

router.get('/users', function(req, res, next) {

});

module.exports = router;
