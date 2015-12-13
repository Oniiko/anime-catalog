var mongoose = require('mongoose');
var Rating_Data = require('../models/user_rating').Rating_Data;
var User_Rating = require('../models/user_rating').User_Rating;
var RatingData = null;

function getRatingData(callback) {
  	if (RatingData != null) callback(RatingData);
  	User_Rating.find({}, function(err, data){
  		RatingData = {};
  		for (var i = 0; i < data.length; i++) {
  			var per_user = data[i];
  			//var user = {username: per_user.username};
  			var anime = {};
  			for (var j = 0; j < per_user.data.length; j++)
  			{
  				var title = per_user.data[j].title; //.replace("'", "");
  				anime[title] = per_user.data[j].rating;
  			}
  			RatingData[per_user.username] = anime;

  		}
  		if (RatingData!=null) callback(RatingData);
  	});
}

function distance_similarity(userdata, user1, user2) {
    var ratings1 = userdata[user1];
    //console.log(ratings1);
    var ratings2 = userdata[user2];
    //console.log(ratings2);
    var sum = 0.0;
    for (var title in ratings1) {
    	if (ratings2[title] != null) {
    		var difference = ratings1[title] - ratings2[title];
    		sum += difference*difference;
    	}
    }
    if (sum == 0.0) return 0.0;
    return 1/(1 + sum);
}

function pearson_similarity(userdata, user1, user2) {
	var common_keys = [];
	var ratings1 = userdata[user1];
    var ratings2 = userdata[user2];
    for (var title in ratings1) {
    	if (ratings2[title] != null) common_keys.push(title);
    }
    //console.log(common_keys);
    if (common_keys.length == 0) return 0;
    var n = common_keys.length;
    var sum1 = 0.0;
    var sum2 = 0.0;
    var sum1Square = 0.0;
    var sum2Square = 0.0;
    var sum12 = 0.0;
 	common_keys.forEach(function(title){
 		sum1 += ratings1[title];
 		sum2 += ratings2[title];
 		sum1Square += ratings1[title]*ratings1[title];
 		sum2Square += ratings2[title]*ratings2[title];
 		sum12 += ratings1[title]*ratings2[title];
 	});
 	var num = sum12 - (sum1 * sum2 / n);
 	var den = Math.sqrt((sum1Square - sum1*sum1/n) * (sum2Square - sum2*sum2/n));
  	if (den == 0.0 ) return 0.0;
  	return num/den;
}

function top_matches(userdata, user, n, sim_function) {
	if (n == null) n = 5;
	if (sim_function == null) sim_function = pearson_similarity;
	var scores = [];
	for (var myuser in userdata) {
		if (myuser == user) continue;
		var score = sim_function(userdata, myuser, user);
		scores.push({username: myuser, score: Math.round(score*100)/100});
	}
	scores.sort(function(user1, user2) {return user2.score - user1.score;});
	return scores.slice(0, n);

}

function recommend(userdata, user, n, sim_function) {
	if (n == null) n = 5;
	if (sim_function == null) sim_function = pearson_similarity;
	var totals = {};
	var scoreSums = {};
	for (var myuser in userdata) {
		if (myuser == user) continue;
		var score = sim_function(userdata, myuser, user);
		if (score <= 0) continue;
		for (var anime in userdata[myuser]) {
			if (userdata[user][anime] == null) {
				if (totals[anime] == null) totals[anime] = 0.0;
				totals[anime] += userdata[myuser][anime] * score;
				if (scoreSums[anime] == null) scoreSums[anime] = 0.0;
				scoreSums[anime] += score;
			}			
		}
	}
	rankings = [];
	for (var anime in totals) {
		rankings.push({anime: anime, score: Math.round(totals[anime]/scoreSums[anime]*100)/100});
	}
	rankings.sort(function(anime1, anime2) {return anime2.score - anime1.score;});
	return rankings.slice(0, n);
}

module.exports = {
	getRatingData: getRatingData,
	distance_similarity: distance_similarity,
	pearson_similarity: pearson_similarity,
	top_matches: top_matches,
	recommend: recommend,
}