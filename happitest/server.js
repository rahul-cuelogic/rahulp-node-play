var Hapi = require('hapi');
var good = require('good');

var server = new Hapi.Server();
server.connection({ port: 3000 });


server.route({
    method:'GET',
    path:'/hello',
    handler: function(request, reply){
        reply('hello world !!');
    }

});


server.route({
    method:'GET',
    path:'/{name}',
    handler: function(request, reply){
        reply('Hello, '+ encodeURIComponent(request.params.name));
    }

});

server.route({
        method: 'GET',
        path: '/hello-static',
        handler: function (request, reply) {
            reply.file('./public/hello.html');
        }
});


server.register({
    register: good,
    options: {
        reporters: [{
            reporter: require('good-console'),
            events: {
                response: '*',
                log: '*'
            }
        }]
    }
}, function (err) {
    if (err) {
        throw err; // something bad happened loading the plugin
    }

    server.register(require('inert'), function (err) {
        if (err) {
            throw err;
        }

        server.start(function () {
            server.log('info', 'Server running at: ' + server.info.uri);
        });
       
    });
});





server.register(require('inert'), function (err) {
    if (err) {
        throw err;
    }

    
});

