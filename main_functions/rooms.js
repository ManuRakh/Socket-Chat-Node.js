var usernames = 			{}; //массив с именами пользователей
var rooms = 				[]; //массив  с комнатами, по умолчанию при входе в приложение будет кидать в Лобби
var usersInfo = 			[];
const messages_functions = 	require("./messages.js"); 
const User = require("./support_classes/User").get_user_class()
const Message = require("./support_classes/Message").get_message_class()



//===========================Модуль добавляет пользователя в сеть========================================

exports.addUser = (socket, io) =>{
    socket.on('ADD_USER', async (username,hash) => {
        socket.username = username;
		socket.room = username+hash; 
		let user = new User(username, hash)//id генерируется либо из бд по айди юзера, либо рандомно, пока что рандомно
		if(io.rooms.filter((x)=>x.user_class===user).length===0)
		io.rooms.push({roomName:username, hash:hash, owner:true,  user_class:user})
		usernames[username] = username;
		console.log(socket.room)
		switchRoomByServer(socket, username, hash)
        socket.emit('UPDATE_ROOMS', rooms, username);
        console.log( username + " подключился к " + socket.room +" room" );//сообщение о подключении юзера в консоль
        });
}

exports.add_user_to_conversation = (socket, io) =>{
	socket.on('ADD_TO_MAIN_ROOM', async (username,hash) => {
		const main_room = "main_room"
		socket.username = username;
		socket.room = main_room+hash; 
		let user = new User(username, hash)//id генерируется либо из бд по айди юзера, либо рандомно, пока что рандомно
		user.add_room(main_room)
		switchRoomByServer(socket, main_room, hash)
		socket.emit('UPDATE_ROOMS', rooms, main_room);
		console.log( username + " подключился к " + socket.room +" room" );//сообщение о подключении юзера в консоль
	})
};


//===========================Модуль отправки сообщения на сервер========================================
exports.toServerMess = (socket, io) => {
	
    socket.on('TO_SERVER_MESS', function(data) { 
		let obj = { //отправка сообщения в чат
			role: data.role, 
			author: data.author, 
			message: data.message, 
			request: data.request, 
			time: data.time
		}
		console.log(data.current_room)
		io.sockets["in"](data.current_room).emit('TO_CHAT_MESS', obj);
	});
}

//===========================Модуль создания get_all_conversations========================================

/**
 * messages берет данные из бд по api
 * current_room так же берется из api
 * 
 */
exports.get_all_conversations = (socket, io) => {
	socket.on("GET_ALL_CONVERSATIONS", async ()=>{
		let user = get_current_user(socket, io)
		const messages = []
		const current_room = ""
		const msgs_and_rooms = new Message(messages, current_room)
		msgs_and_rooms.get_rooms_and_messages()
		socket.emit("GET_ALL_CONVERSATIONS",user.get_user_rooms())
	})
}

//===========================отсоединяет пользователя от сети========================================
exports.disconnect=  function(socket) //
{
    socket.on('disconnect', function(data) {
	});
}

//===========================Модуль Меняет комнату========================================
exports.switchRoom = function(socket, io)
{
	socket.on('SWITCH_ROOM', function(newroom) { //функция для изменения текущей комнаты
		const user = get_current_user(socket, io)
		const oldroom = user.get_current_room()
		user.change_current_room(newroom)
        socket.leave(socket.room);
        socket.join(newroom);
        socket.emit('CLEAN_CHAT');
        socket.emit('TECH-MESSEGE', 'server', 'you have left room ' + oldroom);
        socket.emit('TECH-MESSEGE', 'server', 'you have connected to ' + newroom + "room");
        socket.broadcast.to(oldroom).emit('TECH-MESSEGE', 'server ',socket.username + ' has left this room');
        socket.room = newroom;
        socket.broadcast.to(newroom).emit('TECH-MESSEGE', 'server ',socket.username + ' has joined this room');
        socket.emit('UPDATE_ROOMS', rooms, newroom);
        // messages_functions.show_mess_to_admin(socket, newroom, io);//показывает историю сообщений админу(Оператору)	
        });
}

//===========================Модуль Удаляет комнату========================================
exports.deleteRoom = (socket, io) => {
    socket.on("DETELE_ROOM", function(roomName, hash) {
		const user = get_current_user(socket, io)
		user.remove_room(roomName, hash)
		remove_room(socket, io, roomName, hash)
		socket.leave(roomName+hash)
		io.sockets.emit('UPDATE_ROOMS', user.get_all_rooms(), socket.room);  //обновляет комнаты после удаления оной
		socket.emit('CLEAN_CHAT');
	});
}

//===========================Модуль Создает комнату========================================
exports.createRoom = (socket, io) =>{
    socket.on('CREATE_ROOM', function(room_info) { //функция для создания комнаты
		const user = get_current_user(socket, io)
		user.add_room(room_info.roomName, room_info.hash)
		io.rooms.push({roomName:room_info.roomName, hash:room_info.hash, user_class: user})
		const room = get_room_info(socket, io, room_info.hash, room_info.roomName)
		console.log(room)
		socket.leave(socket.room)
		socket.join(room_info.roomName+room_info.hash)
		io.sockets.emit('UPDATE_ROOMS',  user.get_all_rooms(), socket.room);  //вызов в index.html
	});
}



function get_current_user(socket, io){
	return io.rooms.filter((x)=>x.roomName===socket.username&&x.owner===true)[0].user_class
}
function get_room_info(socket, io, hash, roomName){
	return io.rooms.filter((x)=>x.hash===hash&&x.roomName===roomName)
}
function remove_room(socket, io, roomName, hash){
	return io.rooms.filter((x)=>x.hash===hash&&x.roomName===roomName)
}

//===========================Модуль изменения комнаты========================================

function switchRoomByServer (socket, newroom, hash)
{
    var oldroom;
	oldroom = socket.room;
	socket.leave(socket.room);
	socket.join(newroom+hash);
	//socket.emit('TECH-MESSEGE', 'server', 'you have left room ' + oldroom);
	socket.emit('TECH-MESSEGE', 'server', 'you have connected to ' + newroom+hash);
	//socket.broadcast.to(oldroom).emit('TECH-MESSEGE', 'server ',socket.username + ' has left this room');
	socket.room = newroom+hash;
	socket.broadcast.to(newroom+hash).emit('TECH-MESSEGE', 'server ',socket.username + ' has joined this room');
	socket.emit('UPDATE_ROOMS', rooms, socket.room);
}

//===========================Модуль извлечения информации о пользователе========================================

//===========================Функция удаления перменной из массива данных========================================

//===========================Функция поиска вхождения строки  в массиве========================================
// function makeHash(length) {
// 	var result           = '';
// 	var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
// 	var charactersLength = characters.length;
// 	for ( var i = 0; i < length; i++ ) {
// 	   result += characters.charAt(Math.floor(Math.random() * charactersLength));
// 	}
// 	return result;
//  }