var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var Anime_User_Rating = new Schema({
    id: ObjectId,
    user_id: ObjectId,
    anime_id: ObjectId,
    rating: Number,
    status: String,
    date_started: Date,
    date_finished: Date,
    episodes_seen: Number,
    review: {
        text: string,
        created_at: Date,
        updated_at: Date
    }
    tags: [String]
    created_at: Date,
    updated_at: Date
});

mongoose.model('Anime_User_Rating', Anime_User_Rating);