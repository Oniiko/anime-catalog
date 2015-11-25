var express = require('express');
var router = express.Router();

var Anime = require('../models/anime').Anime;
var Manga = require('../models/manga').Manga;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Anime DB' });
});

router.get('/anime', function(req, res, next) {
  	Anime.find({}, function(err, anime, count) {
  		res.render('index', {'list': anime, title: 'Anime' });
  	});
});

router.get('/manga', function(req, res, next) {
	Manga.find({}, function(err, anime, count) {
		res.render('index', {'list': manga, title: 'Manga' });
	});
});

module.exports = router;
