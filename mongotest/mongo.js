var Db= require('mongodb').Db,
	Connection= require('mongodb').Connection,
	Server= require('mongodb').Server,
	async= require('async');

var host='localhost';
var port= Connection.DEFAULT_PORT;

var db= new Db("Users",
				new Server(host,
							port,
							{auto_reconnect:true, poolSize:20}),
				{w:1});


var addr=[
		{ 
			userId: 4,
			street:'J M Road',
			city:'Pune',
			Country:'India'
		},
		{	userId: 5,
			street:'S B Road',
			city:'Pune',
			Country:'India'
		},
		{
			userId: 6,
			street:'East street Road',
			city:'Pune',
			Country:'India'
		}
];


var user1= {
				_id:4,
				firstName: "Rahul",
				lastName: "Palake"
			};

var user2= {
				_id:5,
				firstName: "John",
				lastName: "Doe"
			};
			
var user3= {
				_id:6,
				firstName: "Jack",
				lastName: "Curt"
			};


var users, address;

//db.dropDatabase();

async.waterfall([

		function(cb){
			db.collection('users', cb);
		},

		function(users_coll, cb){
			users= users_coll;
			db.collection('address', cb);
		},

		function(addr_coll, cb){
			address= addr_coll;
			users.insert(user1, {safe:true}, cb);
		},

		function(doc, cb){
			console.log('1. success');
			console.log(doc);
			users.insert([user2, user3], {safe:true}, cb);
			for(var i=0; i<addr.length; i++){
						addr[i]._id=addr[i].city+"_"+addr[i].userId;
					}

			address.insert(addr,{safe:true}, cb);
		},

		function(docs, cb){
					console.log('2. success');
					console.log(docs);
					cb(null);

				}

	],
	//result function
	function(err, results){
		console.log(err);
		db.close();
	});