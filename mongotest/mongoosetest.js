var mongoose= require("mongoose");
var db= mongoose.connection;

db.on("error", console.error);

db.once("open", function(){

	var movieSchema = new mongoose.Schema({
		title: { type: String },
		rating: String,
		releaseYear: Number,
		hasCreditCookie: Boolean
	});

	//custom static functions for finding records with credit cookies
	movieSchema.statics.findAllWithCreditCookies = function(callback) {
		return this.find({ hasCreditCookie: true }, callback);
	};

	//custom static functions for finding records with release year
	movieSchema.statics.findAllWithReleaseYear = function(callback) {
		return this.find({ releaseYear: '2014' }, callback);
	};

	var Movie= mongoose.model('Movie', movieSchema);

	var thor = new Movie({
		title: 'Thor',
		rating: 'PG-13',
		releaseYear: '2011',
		hasCreditCookie: true
	});

	

	thor.save(function(err, thor) {
	  if (err) return console.error(err);
	  	console.dir(thor);
	});

	var amzingSpiderman = new Movie({
		title: 'The Amazing Spiderman',
		rating: 'PG-13',
		releaseYear: '2014',
		hasCreditCookie: true
	});

	amzingSpiderman.save(function(err, thor) {
	  if (err) return console.error(err);
	  	console.dir(thor);
	});


	//retrieving documents

	// Find a single movie by name.
	Movie.findOne({ title: 'Thor' }, function(err, thor) {
	  if (err) return console.error(err);
		console.dir(thor);
	});

	// Find all movies.
	Movie.find(function(err, movies) {
	  if (err) return console.error(err);
		console.dir(movies);
	});

	// Find all movies that have a credit cookie.
	Movie.find({ hasCreditCookie: true }, function(err, movies) {
	  if (err) return console.error(err);
		console.dir(movies);
	});


	

	// Use the helper as a static function of the compiled Movie model.
	Movie.findAllWithCreditCookies(function(err, movies) {
		if (err) return console.error(err);
		//console.dir("========output from custom function==========");
		console.dir(movies);
	});

	
	// Use the helper as a static function of the compiled Movie model.
	Movie.findAllWithReleaseYear(function(err, movies) {
		if (err) return console.error(err);
		//console.dir("========output from custom function==========");
		console.dir(movies);
	});



});

mongoose.connect('mongodb://localhost/test');

