var http = require('http');

var s = http.createServer(function(req, res){

	console.log('I got request');
	res.end("Thanks for calling !!")
});

s.listen('8080');