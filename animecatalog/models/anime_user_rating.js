var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var Anime_User_Rating = new Schema();
Anime_User_Rating.add({
    id: ObjectId,
    user_id: ObjectId,
    anime_id: ObjectId,
    rating: Number,
    status: String,
    date_started: Date,
    date_finished: Date,
    episodes_seen: Number,
    review: {
        text: String,
        created_at: Date,
        updated_at: Date
    },
    tags: [String],
    created_at: {type: Date},
    updated_at: {type: Date}
});

Anime_User_Rating.pre('save', function(next){
    now = new Date();
    this.updated_at = now;
    if ( !this.created_at ) {
        this.created_at = now;
    }
    next();
});

var Anime_User_Rating = mongoose.model('Anime_User_Rating', Anime_User_Rating);
module.exports = {
    Anime_User_Rating: Anime_User_Rating
}