var request = require('request'),
	fs = require("fs"),
	readline = require('readline');
var Rating_Data = require('../models/user_rating').Rating_Data;
var User_Rating = require('../models/user_rating').User_Rating;
//Using request module, sends request to api endpoint and processes body
var api_request = function(url, username) {
	request(url, function (error, response, body) {
  		if (!error && response.statusCode == 200) {
  			var data = body;
    		//console.log(data);
			process_data(data, username);
  		}
  		else {
  			console.log(error);
  		}
	});
}

//Creates the document using data from api
var process_data = function(data, username) {
	var data_ob = JSON.parse(data);
	//console.log(data_ob);
    var rating_data = [];
	for (var i = 0; i < data_ob.length; i++) {
		if (data_ob[i].rating.value != null) {
          //console.log(data_ob[i].anime.title + ", " + data_ob[i].rating.value);
        var rating = new Rating_Data({
        	title: data_ob[i].anime.title, 
        	rating: data_ob[i].rating.value
        });
        rating_data.push(rating);
      }
    }
	var user_ratings = new User_Rating({
		username: username,
		data: rating_data
	});
	user_ratings.save(function(){
		console.log(user_ratings);
	});
}

//Executes api_request() for the set number of anime/manga
var driver = function() {

	var file_pathname = "/Users/nicholaswen/school-workspace/nyu-csci-ua-0480-002-fall-2015/nw683-final-project/animecatalog/api_wrapper";
	file_pathname += "/hummingbird_users_v4"
	//console.log(file_pathname)
  	var rl = readline.createInterface({
    	input: fs.createReadStream(file_pathname)
   	});

	rl.on('line', function (username) {
  		//console.log('Line from file:', line);
  		username = username.trim();
  		User_Rating.findOne({username: username}, function(err, user, count) {
			if(user == null) {
				api_request('http://hummingbird.me/api/v1/users/' + username + '/library', username);
			}
		});
	});
}

module.exports = {
	driver: driver
}