// Retrieve
var MongoClient = require('mongodb').MongoClient;
var async = require('async');

// Connect to the db
MongoClient.connect("mongodb://localhost:27017/test", function(err, db) {
	if(err) {
   		return console.dir(err);
  	} 

  	/*db.collection('testcollection').drop(function(err, result){});
	
	var collection = db.collection('testcollection');
	var doc = {mykey:10, fieldtoupdate:10};

	collection.insert(doc, {w:1}, function(err, result) {

		console.log('updating;')
		collection.update({mykey:10}, {$set:{fieldtoupdate:2}}, {w:1}, function(err, result) {
				if(err){
					console.log(err);
				}

				console.log("success"+result);
		});
	})*/

	//collection.update({mykey:10}, {$set:{fieldtoupdate:2}}, {w:1}, function(err, result) {};

	// var doc2 = {mykey:2, docs:[{doc1:1}]};

	// collection.insert(doc2, {w:1}, function(err, result) {
	// collection.update({mykey:2}, {$push:{docs:{doc2:1}}}, {w:1}, function(err, result) {});
	// });

	//db.close();
	
	var collection='';

	async.auto({
			'drop_collection':function(cb){
				db.collection('testcollection').drop();
				var cl = db.collection('testcollection');
				collection=cl;
				cb(null);
			},

			'add_collection_1': ['drop_collection', function(cb, results){

				var doc = {mykey:10, fieldtoupdate:10};
				
				collection.insert(doc, {w:1}, function(err, res){});
				cb(null); 
			}],

			'add_collection_2': ['drop_collection', function(cb, results){
				var doc2 = {mykey:2, docs:[{doc1:1}]};
				collection.insert(doc2, {w:1}, function(err, result){});
				cb(null); 

			}],

			'close_connection':['drop_collection', 'add_collection_1', function(cb, results){
				db.close();
				cb(null);
			}],

		}, function(err, results){
			if(err)
				console.log(err);
			else
				console.log(results);
	})
});



