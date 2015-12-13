var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	URLSlugs = require('mongoose-url-slugs'),
	ObjectId = Schema.ObjectId,
    passportLocalMongoose = require('passport-local-mongoose'),
    mongoosePaginate = require('mongoose-paginate');

var Anime_Library_Entry = require('./anime_library_entry').Anime_Library_Entry;
var Manga_Library_Entry = require('./manga_library_entry').Manga_Library_Entry;

var User = new Schema();
User.add({
    id: ObjectId,
    username: String, //{ type: String, unique: true, required: true },
    password: String, //{ type: String, required: true },
    anime_library: [{type: Schema.Types.ObjectId, ref: 'Anime_Library_Entry'}],
    manga_library: [{type: Schema.Types.ObjectId, ref: 'Manga_Library_Entry'}],
    anime_reviews_count: { type: Number, default: 0}, //Cache counter
    manga_reviews_count: { type: Number, default: 0}, //Cache counter
    created_at: Date,
    updated_at: Date
});

var options = ({missingPasswordError: "Wrong password", usernameLowerCase: true, usernameUnique: true});
User.plugin(passportLocalMongoose, options);
User.plugin(URLSlugs('username'));
User.plugin(mongoosePaginate);

var User = mongoose.model('User', User);
module.exports = {
    User: User
}