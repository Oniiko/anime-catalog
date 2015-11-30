var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var Manga_User_Rating = new Schema();
Manga_User_Rating.add({
    id: ObjectId,
    user_id: ObjectId,
    manga_id: ObjectId,
    rating: Number,
    status: String,
    date_started: Date,
    date_finished: Date,
    chapters_read: Number,
    review: {
        text: String,
        created_at: Date,
        updated_at: Date
    },
    tags: [String],
    created_at: Date,
    updated_at: Date
});

Manga_User_Rating.pre('save', function(next){
    now = new Date();
    this.updated_at = now;
    if ( !this.created_at ) {
        this.created_at = now;
    }
    next();
});

var Manga_User_Rating = mongoose.model('Manga_User_Rating', Manga_User_Rating);
module.exports = {
    Manga_User_Rating: Manga_User_Rating
}