var request = require('request');
var Anime = require('../models/anime').Anime;
var Manga = require('../models/manga').Manga;

//Using request module, sends request to api endpoint and processes body
var api_request = function(url, type) {
	request(url, function (error, response, body) {
  		if (!error && response.statusCode == 200) {
  			var data = body;
    		//console.log(data);
    		process_data(data, type);
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

//Creates the document using data from api
var process_data = function(data, type) {
	var data_ob = JSON.parse(data);
	console.log(data_ob);
	if (type == 'anime') {
		var new_anime = new Anime({
			//id: ObjectId,
    		title: data_ob.title,
    		image_url: data_ob.cover_image,
    		type: data_ob.anime_type,
    		aliases: data_ob.alternate_title,
    		genres: genre_formatter(data_ob.genres),
    		started_airing: data_ob.started_airing,
    		finished_airing: data_ob.finished_airing,
    		tags: [],
    		status: data_ob.status,
    		episodes: data_ob.episode_count,
    		episode_length: data_ob.episode_length,
    		average_rating: null,
    		user_ratings: [],
    		synopsis: data_ob.synopsis,
    		//created_at: {type: Date},
    		//updated_at: {type: Date}
		});
		new_anime.save(function(){
			console.log(new_anime);
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
    		image_url: data_ob.poster_image,
    		type: data_ob.manga_type,
    		aliases: manga_aliases,
    		genres: data_ob.genres,
    		//year: Number,
    		tags: [],
    		//status: data_ob.status,
    		chapter_count: data_ob.chapter_count,
    		volume_count: data_ob.volume_count,
    		average_rating: null,
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

//Executes api_request() for the set number of anime/manga
var driver = function() {
	for(var i = 1; i <= 3; i++) {
		var url = "http://hummingbird.me/api/v1/anime/";
		url += i;
		api_request(url, 'anime');
	}

	for(var i = 1; i <= 3; i++) {
		var url = "http://hummingbird.me/full_manga/";
		url += i;
		api_request(url, 'manga');
	}
}

module.exports = {
	driver: driver
}