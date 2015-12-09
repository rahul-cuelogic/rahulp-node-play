var socketio = require('socket.io');
var io;
var guestNumber = 1;
var nickNames = {};
var namesUsed = [];
var currentRoom = {};

exports.listen = function(server){

	//start socket.io server allowing it to piggy back on existing HTTP server
	io= socketio.listen(server);
	io.set('log level', 1);

	//handle connection event
	io.sockets.on('connection', function(socket){

		//assigne user a guest name when they connect
		guestNumber = assignGuestName(socket, guestNumber, nickNames, namesUsed);

		//place user in lobby room when they connect
		joinRoom(socket, 'Lobby');

		//handle user message, name change & room joining
		handleMessageBroadcasting(socket, nickNames);
		handleNameChangeAttempts(socket, nickNames, namesUsed);
		handleRoomJoining(socket);

		//provide user with list of occupied rooms on request
		socket.on('rooms', function(){
			socket.emit('rooms', io.sockets.manager.rooms);
		});

		//handle user disconnection
		handleClientDisconnection(socket, nickNames, namesUsed);

	});
};


function assignGuestName(socket, guestNumber, nickNames, namesUsed){
	//generate new guest name
	var name='Guest'+guestNumber;

	//store guest name against connection id
	nickNames[socket.id]= name;

	//send joined user this guest name
	socket.emit('nameResult', {
		success:true,
		name: name
	});

	//add name to used list
	namesUsed.push(name);

	//increment the guestnumber count
	return guestNumber+1;
}


function joinRoom(socket, room){
	
	//make user join room
	socket.join(room);

	//current room for user
	currentRoom[socket.id]= room;

	//let user know they are in new room
	socket.emit('joinResult', {'room': room});

	//let others in room they have a new member
	socket.broadcast.to(room).emit('message', {
		text: nickNames[socket.id]+' has joined '+ room +'.'
	});

	//send summary of other users in room to the user
	var usersInRoom= io.sockets.clients(room);
	if (usersInRoom.length > 1 ){
		var usersInRoomSummary = 'Users currently in '+room+': ' ;

		for (var index in usersInRoom){
			var userSocketId= usersInRoom[index].id;
			if (socket.id != userSocketId){

				if (index > 0){
					usersInRoomSummary += ', ';
				}

				usersInRoomSummary+= nickNames[userSocketId];
			}
		}
		
		usersInRoomSummary+='.';

		socket.emit('message', {text:usersInRoomSummary});
	}

}


function handleNameChangeAttempts(socket, nickNames, namesUsed){
	//add listner for nameAttempt event
	socket.on('nameAttempt', function(name){
		//dont allow nickNames to begin with 'Guest'
		if (name.indexOf('Guest')> 0){
			socket.emit({
				success: false,
				message: 'name can not begin with "Geust".'
			});
		
		} else {
			//if user is not already registered, register it
			if (namesUsed.indexOf(name) == -1){
				var previousName= nickNames[socket.id];
				var previousNameIndex = namesUsed.indexOf(previousName);

				//add new name to used names
				namesUsed.push(name);
				nickNames[socket.id] = name;

				//remove previousname to make it available for other users
				delete namesUsed[previousNameIndex];

				socket.emit('nameResult', {
					success: true,
					name: name
				});

				socket.broadcast.to(currentRoom[socket.id]).emit('message', {
					text: previousName + ' is now known as ' + name + '.'
				});

			} else {
				socket.emit('nameResult', {
							success: false,
							message: 'That name is already in use.'
				});
			}
		}
	});
}

//sending chat messages
function handleMessageBroadcasting(socket) {
	socket.on('message', function (message) {
		socket.broadcast.to(message.room).emit('message', {
			text: nickNames[socket.id] + ': ' + message.text
		});
	});
}


function handleRoomJoining(socket) {
	socket.on('join', function(room) {
		socket.leave(currentRoom[socket.id]);
			joinRoom(socket, room.newRoom);
	});
}


function handleClientDisconnection(socket) {
	socket.on('disconnect', function() {
		var nameIndex = namesUsed.indexOf(nickNames[socket.id]);
		delete namesUsed[nameIndex];
		delete nickNames[socket.id];
	});
}