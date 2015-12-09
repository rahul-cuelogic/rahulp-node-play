var http= require('http');
var fs= require('fs');
var mime= require('mime');
var path= require('path');
var cache= {};


//handle non-existing resources

function send404(res){

	res.writeHead(404, {"content-type":"text/plain"});
	res.write('Error 404: resource not found');
	res.end();
}

//serve file data
function sendFile(res, filePath, fileContents){
	res.writeHead(200, 
					{"content-type": mime.lookup(path.basename(filePath))});

	res.end(fileContents);
}


//serve static files from cache
function serveStatic(res, cache, absPath){
	
	//check if file is cached in memory
	if(cache[absPath]){
		sendFile(res, absPath, cache[absPath]);
	} else {

		//check if file exists
		fs.exists(absPath, function(exists){

			if(exists){

				//Read from disk
				fs.readFile(absPath, function(err, data){
					
					if(err){
						send404(res);
					}

					//add to cache & serve file content
					cache[absPath]= data;
					sendFile(res, absPath, data);
				});

			} else {
				send404(res);
			}
		});
	}
}

var server= http.createServer(function(req, res){
	var filePath= false;

	//default file to serve
	if(req.url == '/'){
		filePath= 'public/index.html';
	} else {
		filePath= 'public'+req.url;
	}

	var absPath= './'+filePath;

	serveStatic(res, cache, absPath);
});


//start listening for request
server.listen(3000, function(){

	console.log("server listening on port:3000");
});


//setup socket.io server
var chatServer = require('./lib/chat_server');
chatServer.listen(server);
