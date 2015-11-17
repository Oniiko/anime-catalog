Project Description
	
	A web app for documenting, rating, and reviewing anime/manga. Users can search for anime/manga in order to read the synopsis, # of episodes, see user reviews for the anime/manga, and see an average rating for the anime/manga. Also the user can save their ratings and reviews in the database, which will be displayed in a table that categorized into: watching, completed, ongoing, and dropped.

Schemas

	User:
		_id: <ObjectId1>
		username: String
		password: String
		anime_user_ratings: [Anime_user_ratings]
		manga_user_ratings: [Manga_user_ratings]
		reviews: [review]

		This document contains the user's personal information

	Anime_user_rating:
		_id: <ObjectId2>
		user_id: <ObjectId1>
		anime_title: String
		rating: Number
		status: String
		episodes_seen: String
		tags: [String]

		Description: This is the user's personal rating of an anime that can include a review

	Review:
		_id: ObjectId
		text: String

		
	Manga_user_rating:
		_id: <ObjectId2>
		user_id: <ObjectId1>
		manga_title: String
		owner_id: Number
		status: String
		chapters_read: String
		rating: Number
		tags: [String]

		Description: This is the user's personal rating of a manga that can include a review


	Anime:
		_id: <ObjectId1>
		title: String
		aliases: [String]
		genre: [Genres]
		tags: [Tags]
		status: []
		episodes: [Episode]
		average_rating: Number
		user_ratings: [User_rating]
		synopsis: String
		created_at:

		Description: This is the information about


	Manga {
		_id: <ObjectId1>
		title: String
		aliases: [String]
		genre: [String]
		tags: [String]
		status:

		average_rating: Number
		user_rating: [User_rating]
		synopsis: String

		created_at: 
	}

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
		- Possible modules: multer (https://github.com/expressjs/multer)

	* Sorting database entries based on a value (ex. following criteria: Popular, New, Top)
		- Calculate values based on db entries (efficiently) and sort by those values
		- This lets me sort and order the lists in a meaningful way for users to see new, top, and popular entries.
		- Possible modules: This should be easy enough to implement just useing mongodb queries

	* Use an api from a popular anime db website, such as MAL or Hummingbird to extract anime descriptions
		- This is an api to retrieve information anime, such as: a description, running days, aliases, etc...
		- This makes it easier and more convenient to maintain an accurate list of anime with good descriptions. It's a lot better than hardcoding the details.
		- I will probably need to convert xml to json
		- Possible modules: MAL unofficial API(https://github.com/chuyeow/node-myanimelist-api)

	* Set up a cron job to retrieve data from api on a timed basis
		- A time based job (probably every day or so) that updates and adds anime/manga entries to the database
		- This lets the list of anime to be maintained automatically, instead of a manual search being needed
		- Possible modules: node-schedule(https://www.npmjs.com/package/node-schedule)
							node-cron(https://github.com/ncb000gt/node-cron)


	

