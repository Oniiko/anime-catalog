Project Description
	
A web app for documenting, rating, and reviewing anime/manga. Users can search for anime/manga in order to read the synopsis, # of episodes, see user reviews for the anime/manga, and see an average rating for the anime/manga. 
Also the user can save their ratings and reviews in the database, which will be displayed in a table that categorized into: watching, completed, ongoing, and dropped.

The anime/manga entries 

Schemas

	var User = new Schema({
		id: ObjectId,
		username: String,
		password: String,
		anime_user_ratings: [Anime_User_Rating],
		manga_user_ratings: [Manga_User_Rating],
		anime_reviews_count: Number, //Cache counter
		manga_reviews_count: Number, //Cache counter
		created_at: Date,
		updated_at: Date
	});
		This document contains the user's personal information and stores their ratings and reviews

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
		tags: [String],
		created_at: Date,
		updated_at: Date
	});

		Description: This is the user's personal rating of an anime that can include a review

		
	var Manga_User_Rating = Schema({
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

		Description: This is the user's personal rating of a manga that can include a review

	var Anime = new Schema({
		id: ObjectId,
		title: String,
		aliases: [String],
		genre: [Genres],
		year: Number,
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
		id: ObjectId,
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

Wireframes
	
I originally drew this using balsamiq, but I didnt realize that it doesn't save past 1 hour on the web app trial, so I lost my work. I redrew it in my notebook, but when I tried scanning, it was un-readable. I can redraw these if the pictures are not good enough. 

Homepage
![Homepage](/documentation/homepage.jpg)
Login/Signup and List
![Login/Signup and List](/documentation/login_signup_list.jpg)
All Manga/Anime List
![All Manga/Anime List](/documentation/all_manga_anime.jpg)
Individual Manga/Anime List
![Individual Manga/Anime List](/documentation/page_for_individual_anime_manga.jpg)


Sitemap

![Sitemap](/documentation/AIT_FinalProjectSitemap.png)


List of user stories:

	As a anime/manga fan, I want to catalog which anime/manga I've watched/read and rate/review them, so I can remember what I watched/read and share my experience with friends.

	As a watcher/reader of anime/manga, I want to find new shows to watch by looking at other people's ratings and reviews.

	As a critic of anime/manga, I want to publish my review of anime/manga, so I can share my understanding of the contents with other fans.

Modules/Things to Look Into

	(1 point) Model View Controller
		- This is the categorization of functionality into three categories: view (output representation of information), model (manages the data of the application), and controller (accepts inputs and converts it to commands for the model or view).
		- This lets the code to be modularized, so it's organized to read and program in.
		- I have experience with Ruby on Rails, so I prefer this layout.

	(1 point) Use a CSS framework throughout your site, use a reasonable of customization of the framework
		- CSS frameworks make setting up styling a lot easier.
		- I can use preset styling to make grids and format overall page design. Also buttons and forms can be easily stylized using frameworks
		- I will probably use Foundation for this.


	(3 points) Integrate user authentication

	(2 points) Perform client side form validation

	(2 points) Unit testing with Javascript
		- The testing of individual units of code in the web app, checking for correctness.
		- This makes it easier to find bugs when changing code or adding functionalities
		- Possible modules: Jasmine or Mocha

	(2 points) * Use an api from a popular anime db website, such as MAL or Hummingbird to extract anime descriptions
		- This is an api to retrieve information anime, such as: a description, running days, aliases, etc...
		- This makes it easier and more convenient to maintain an accurate list of anime with good descriptions. It's a lot better than hardcoding the details.
		- If I use the MyAnimeList API, I will use http://myanimelist.net/modules.php?go=api
		- If I use the Hummingbird API, I will use https://github.com/hummingbird-me/hummingbird/wiki/API-v1-Methods

	(1 point) * Set up a cron job to retrieve data from api on a timed basis
		- A time based job (probably every day or so) that updates and adds anime/manga entries to the database
		- This lets the list of anime to be maintained automatically, instead of a manual search being needed
		- Possible modules: [node-schedule](https://www.npmjs.com/package/node-schedule)
							[node-cron](https://github.com/ncb000gt/node-cron)

	(1 point) * Paginate the reviews and the all anime and manga lists
		- This splits the total number of items loaded per page. So, I can set it to 5 reviews appearing per page or 10 and a page selector can be at the bottom of each page
		- This prevents pages from becoming too long and makes it less problematic loading large numbers of reviews/anime
		- Possible modules: [express-paginate](https://github.com/expressjs/express-paginate)


	

