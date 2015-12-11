var bcrypt = require('bcrypt');
var async= require('async');
var mypass= 'notsosafestring';

var hashGenerated='';
var saltGenerated='';

async.waterfall([
	

	function _getSalt(cb){
		
		var salt = bcrypt.genSaltSync(10);
		cb(null, salt);
	},

	function _getHash(salt, cb){
		var hashGenerated= bcrypt.hashSync(mypass, salt);
		cb(null, hashGenerated);
		//cb(null);
	},

	function _compareHash(hash, cb){
		var result= bcrypt.compareSync(mypass, hash);
		cb(null, result);
	},
		
	], function (err, result) {
	    if(err)
	    	console.log(err);
	    
		if(result){
			console.log('hash matched');
		} else {
			console.log('hash match failed');
		}
    
});
