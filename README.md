Project Description
	
	A web app for documenting, rating, and reviewing anime/manga. Users can search for anime/manga in order to read the synopsis, # of episodes, see user reviews for the anime/manga, and see an average rating for the anime/manga. 
	Also the user can save their ratings and reviews in the database, which will be displayed in a table that categorized into: watching, completed, ongoing, and dropped.

Schemas

	var User = new Schema({
		_id: <ObjectId1>
		username: String,
		password: String,
		anime_user_ratings: [Anime_User_Rating],
		manga_user_ratings: [Manga_User_rating],
		anime_reviews_count: Number, //Cache counter
		manga_reviews_count: Number, //Cache counter
		created_at: Date,
		updated_at: Date
	});
		This document contains the user's personal information and stores their ratings and reviews

	var Anime_User_Rating = new Schema({
		_id: <ObjectId>
		user_id: <ObjectId>
		anime_id: <ObjectId>
		rating: Number
		status: String
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

		Description: This is the user's personal rating of an anime that can include a review

		
	var Manga_User_Rating = Schema({
		_id: <ObjectId>,
		user_id: <ObjectId>,
		manga_id: <ObjectId>,
		rating: Number,
		status: String,
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

		Description: This is the user's personal rating of a manga that can include a review

	var Anime = new Schema({
		_id: <ObjectId1>,
		title: String,
		aliases: [String],
		genre: [Genres],
		year,
		tags: [String],
		status: String,
		episodes: Number,
		average_rating: Number,
		user_ratings: [Anime_User_Rating],
		reviews: [Anime_Review],
		synopsis: String,
		created_at: Date,
		updated_at: Date
	});

		Description: This is the information about the anime.

	var Manga = new Schema({
		_id: <ObjectId1>,
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
		Description: This is the information about the manga.

Wireframe



Sitemap


List of user stories:

	As a anime/manga fan, I want to catalog which anime/manga I've watched/read and rate/review them, so I can remember what I watched/read and share my experience with friends.

	As a watcher/reader of anime/manga, I want to find new shows to watch by looking at other people's ratings and reviews.

	As a critic of anime/manga, I want to publish my review of anime/manga, so I can share my understanding of the contents with other fans.

Modules/Things to Look Into

	* Image Uploading for user-uploaded anime/manga images
		- Image uploading from web page to image folder (subdirectories for each anime?)
		- Maybe, use ajax to upload image
		- This allows users to upload relevant images to an anime/manga
		- Possible modules: [multer](https://github.com/expressjs/multer)

	* Sorting database entries based on a value (ex. following criteria: Popular, New, Top)
		- Calculate values based on db entries (efficiently) and sort by those values
		- This lets me sort and order the lists in a meaningful way for users to see new, top, and popular entries.
		- Possible modules: This should be easy enough to implement just useing mongodb queries

	* Use an api from a popular anime db website, such as MAL or Hummingbird to extract anime descriptions
		- This is an api to retrieve information anime, such as: a description, running days, aliases, etc...
		- This makes it easier and more convenient to maintain an accurate list of anime with good descriptions. It's a lot better than hardcoding the details.
		- I will probably need to convert xml to json
		- Possible modules: [MAL unofficial API](https://github.com/chuyeow/node-myanimelist-api)

	* Set up a cron job to retrieve data from api on a timed basis
		- A time based job (probably every day or so) that updates and adds anime/manga entries to the database
		- This lets the list of anime to be maintained automatically, instead of a manual search being needed
		- Possible modules: [node-schedule](https://www.npmjs.com/package/node-schedule)
							[node-cron](https://github.com/ncb000gt/node-cron)


	

