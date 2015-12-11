var bcrypt = require('bcrypt');
var async= require('async');
var mypass= 'notsosafestring';



async.waterfall([
	

	function _getSalt(cb){
		
		bcrypt.genSalt(10, function(err, salt) {
			if(err){
				cb(err);
			}

			cb(null, salt);
		});


	},

	function _getHash(salt, cb){

		bcrypt.hash(mypass, salt, function(err, hash) {
        	// Store hash in your password DB.
        	
        	if(err){
				cb(err);
			}

			cb(null, hash);
    	});
	},

	function _compareHash(hash, cb){

		bcrypt.compare(mypass, hash, function(err, res) {
    		// res === true since we are using same password

    		if(err){
				cb(err);
			}

			cb(null, res);
		});
	},
		
	], function (err, result) {
	    if(err) {
	    	console.log(err);
	    } else {
			if(result){
				console.log('hash matched');
			} else {
				console.log('hash match failed');
			}
	    }
    
});

