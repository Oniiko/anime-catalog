var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var Manga = new Schema({
    id: ObjectId1,
    title: String,
    aliases: [String],
    genre: [String],
    year: Number,
    tags: [String],
    status: String,
    average_rating: Number,
    user_ratings: [Manga_User_Rating],
    synopsis: String,
    created_at: Date,
    updated_at: Date
});

module.exports = mongoose.model('Manga', Manga);