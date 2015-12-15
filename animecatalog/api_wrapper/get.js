var request = require('request');
var async = require('async');
var Anime = require('../models/anime').Anime;
var Manga = require('../models/manga').Manga;

//Using request module, sends request to api endpoint and processes body
var api_request = function(url, type, id) {
	request(url, function (error, response, body) {
  		if (!error && response.statusCode == 200) {
  			var data = body;
    		//console.log(data);
    		process_data(data, type, id);
  		}
  		else {
  			console.log(error);
  		}
	});
}

//Converts array of genre objects to array of strings
var genre_formatter = function(genres) {
	var output = [];
	genres.map(function(genre) {
		output.push(genre.name);
	});
	return output;
}

//Averages community ratings for manga
var community_ratings_average = function(ratings) {
	if (ratings != null && ratings.length > 0) {
		var output = 0; //Average ratings
		for(var i = 0; i < ratings.length; i++) {
			output += ratings[0];
		}
		output = output/ratings.length;
		output = Math.round(output * 100) / 100;
		return output;
	}
	else {
		return null;
	}
}

//Creates the document using data from api
var process_data = function(data, type, id) {
	var data_ob = JSON.parse(data);
	//console.log(data_ob);
	if (type == 'anime') {
		var new_anime = new Anime({
			//id: ObjectId,
    		title: data_ob.title,
    		hummingbird_id: data_ob.id,
    		hummingbird_rating: (Math.round(data_ob.community_rating * 100) / 100),
    		image_url: data_ob.cover_image,
    		type: data_ob.show_type,
    		aliases: data_ob.alternate_title,
    		genres: genre_formatter(data_ob.genres),
    		started_airing: data_ob.started_airing,
    		finished_airing: data_ob.finished_airing,
    		status: data_ob.status,
    		episodes: data_ob.episode_count,
    		episode_length: data_ob.episode_length,
    		user_ratings: [],
    		synopsis: data_ob.synopsis,
    		//created_at: {type: Date},
    		//updated_at: {type: Date}
		});
		new_anime.save(function(error){
			console.log("hummingbird_id = " + new_anime.hummingbird_id);
			//console.log(new_anime);
		});
	}
	else if (type == 'manga') {
		data_ob = data_ob.full_manga;
		var manga_aliases = [];
		//console.log("--------- " + data_ob.english_title + " ---------");

		//If there's an english title then add that to aliases
		if(data_ob.english_title != undefined) manga_aliases.push(data_ob.english_title);

		var new_manga = new Manga({
    		//id: ObjectId,
    		title: data_ob.romaji_title,
    		hummingbird_id: id,
    		hummingbird_rating: community_ratings_average(data_ob.community_ratings),
    		image_url: data_ob.poster_image,
    		type: data_ob.manga_type,
    		aliases: manga_aliases,
    		genres: data_ob.genres,
    		//year: Number,
    		//status: data_ob.status,
    		chapter_count: data_ob.chapter_count,
    		volume_count: data_ob.volume_count,
    		user_ratings: [],
    		synopsis: data_ob.synopsis,
    		//created_at: {type: Date},
    		//updated_at: {type: Date}
		});
		new_manga.save(function(){
			console.log(new_manga);
		});
	}
	else {
		console.log("Error: invalid type");
	}

}
// Defined outside of driver because of errors with the forloop (It returned one anime i number of times)
var db_fetch = function(param, url, type, id){
	if(type == 'anime') {
		Anime.findOne(param, function(err, anime, count) {
			if(anime == null) {
				api_request(url, 'anime');
			}
		});
	}
	else if (type == 'manga') {
		Manga.findOne(param, function(err, manga, count) {
			if(manga == null) {
				api_request(url, 'manga', id);
			}
		});
	}
	else {
		console.log("Error: Must specify type");
	}
}
//Executes api_request() for the set number of anime/manga
var driver = function() {
	//Get as many as possible
	for(var i = 1; i <= 1000; i++) {
		var id = i;
		var url = "http://hummingbird.me/api/v1/anime/" + id;
		var param = {hummingbird_id: id};
		db_fetch(param, url, 'anime');
	}
	
	for(var i = 1; i <= 1000; i++) {
		var id = i;
		var url = "http://hummingbird.me/full_manga/" + id;
		var param = {hummingbird_id: id};
		db_fetch(param, url, 'manga', id);
	}
}

module.exports = {
	driver: driver
}