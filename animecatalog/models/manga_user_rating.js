var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var Manga_User_Rating = new Schema({
    id: ObjectId,
    user_id: ObjectId,
    manga_id: ObjectId,
    rating: Number,
    status: String,
    date_started: Date,
    date_finished: Date,
    chapters_read: Number,
    review: {
        text: string,
        created_at: Date,
        updated_at: Date
    }
    tags: [String],
    created_at: Date,
    updated_at: Date
});

module.exports = mongoose.model('Manga_User_Rating', Manga_User_Rating);