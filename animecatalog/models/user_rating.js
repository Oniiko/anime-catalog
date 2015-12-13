var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Rating_Data = new Schema();
Rating_Data.add({
    title: String,
    rating: Number
});
var User_Rating = new Schema();
User_Rating.add({
    username: String,
    data: [Rating_Data]
});
var Rating_Data = mongoose.model('Rating_Data', Rating_Data);
var User_Rating = mongoose.model('User_Rating', User_Rating);
module.exports = {
	Rating_Data: Rating_Data,
    User_Rating: User_Rating
}