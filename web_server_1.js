var http = require('http');


function request_handler(req, res){
  var body= "Hey Thanks for calling !!";
  var content_length= body.length;

  //set headers
  res.writeHead(200,{
  	content_type:'text/plain',
  	content_length: content_length
  });

  //set response
  res.end(body);

}

var s= http.createServer(request_handler);

s.listen(8080);