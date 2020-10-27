var usernames = 			{}; //массив с именами пользователей
var rooms = 				[]; //массив  с комнатами, по умолчанию при входе в приложение будет кидать в Лобби
var usersInfo = 			[];
const messages_functions = 	require("./messages.js"); 
const User = require("./support_classes/User").get_user_class()
const Message = require("./support_classes/Message").get_message_class()

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
        // var oldroom;
        // oldroom = socket.room;
        // socket.leave(socket.room);
        // socket.join(newroom);
        // socket.emit('CLEAN_CHAT');
        // socket.emit('TECH-MESSEGE', 'server', 'you have left room ' + oldroom);
        // socket.emit('TECH-MESSEGE', 'server', 'you have connected to ' + newroom + " room");
        // socket.broadcast.to(oldroom).emit('TECH-MESSEGE', 'server ',socket.username + ' has left this room');
        // socket.room = newroom;
        // socket.broadcast.to(newroom).emit('TECH-MESSEGE', 'server ',socket.username + ' has joined this room');
        // socket.emit('UPDATE_ROOMS', rooms, newroom);
        // // messages_functions.show_mess_to_admin(socket, newroom, io);//показывает историю сообщений админу(Оператору)
		// socket.emit('USER-INFO',...usersInfo[newroom]);
		
        });
}

//===========================Модуль Удаляет комнату========================================
exports.deleteRoom = (socket) => {
    socket.on("DETELE_ROOM", function(room) {
		// messages_functions.removeValueFromArr(rooms, room);
		io.sockets.emit('UPDATE_ROOMS', rooms, socket.room);  //обновляет комнаты после удаления оной
		socket.emit('CLEAN_CHAT');
	});
}

//===========================Модуль Создает комнату========================================
exports.createRoom = (socket) =>{
    socket.on('CREATE_ROOM', function(room) { //функция для создания комнаты
		rooms.push(room);
		io.sockets.emit('UPDATE_ROOMS', rooms, socket.room);  //вызов в index.html
	});
}

//===========================Модуль добавляет пользователя в сеть========================================

exports.addUser = (socket, io) =>{
    socket.on('ADD_USER', async (username,id) => {
        socket.username = username;
		socket.room = username; 
		// socket.join(username)
		let user = new User(username, id)//id генерируется либо из бд по айди юзера, либо рандомно, пока что рандомно
		user.add_room(username)
		if(io.rooms.filter((x)=>x.user_class===user).length===0)
		io.rooms.push({name:username, user_class:user})
		usernames[username] = username;
		console.log(socket.room)
		switchRoomByServer(socket, username)
        // socket.broadcast.to(socket.room).emit('TECH-MESSEGE', 'server ',socket.username + ' has connected to this room');//отправка сообщения юзерам данной комнаты о новом сочатчанине
        socket.emit('UPDATE_ROOMS', rooms, username);
        console.log( username + " подключился к " + socket.room +" room" );//сообщение о подключении юзера в консоль
        getUserInfo(username, userInfo,socket, io); //отправляет объект userInfo на хранение на сервер
        });
}

exports.add_user_to_conversation = (socket, io) =>{
	const main_room = "main_room"
	socket.username = username;
	socket.room = main_room; 
	// socket.join(username)
	let user = new User(username, id)//id генерируется либо из бд по айди юзера, либо рандомно, пока что рандомно
	user.add_room(main_room)
	// if(io.rooms.filter((x)=>x.user_class===user).length===0)
	// io.rooms.push({name:username, user_class:user})
	switchRoomByServer(socket, main_room)
	// socket.broadcast.to(socket.room).emit('TECH-MESSEGE', 'server ',socket.username + ' has connected to this room');//отправка сообщения юзерам данной комнаты о новом сочатчанине
	socket.emit('UPDATE_ROOMS', rooms, main_room);
	console.log( username + " подключился к " + socket.room +" room" );//сообщение о подключении юзера в консоль
	getUserInfo(username, userInfo,socket, io); //отправляет объект userInfo на хранение на сервер
};


//===========================Модуль отправки сообщения на сервер========================================
exports.toServerMess = (socket, io) => {
	
    socket.on('TO_SERVER_MESS', function(data) { 
		// io.sockets.emit('UPDATE_ROOMS', rooms, undefined);
		// console.log("rooms", io.rooms)
		let obj = { //отправка сообщения в чат
			role: data.role, 
			author: data.author, 
			message: data.message, 
			request: data.request, 
			time: data.time
		}
		console.log(obj)
		// console.log(data.current_room + " "+ data.role + " "+ data.author + " "+ data.message + " "+ data.request + " "+ data.time);
			
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
		let user = get_current_user(io, socket)
		const messages = []
		const current_room = ""
		const msgs_and_rooms = new Message(messages, current_room)
		msgs_and_rooms.get_rooms_and_messages()
		socket.emit("GET_ALL_CONVERSATIONS",user.get_user_rooms())
	})
}
function get_current_user(io, socket){
	return io.rooms.filter((x)=>x.name===socket.username)[0].user_class
}
function createRoomByServer(socket, roomName, io)
{
  
}

//===========================Модуль изменения комнаты========================================

function switchRoomByServer (socket, newroom)
{
    var oldroom;
	oldroom = socket.room;
	socket.leave(socket.room);
	socket.join(newroom);
	//socket.emit('TECH-MESSEGE', 'server', 'you have left room ' + oldroom);
	socket.emit('TECH-MESSEGE', 'server', 'you have connected to ' + newroom);
	//socket.broadcast.to(oldroom).emit('TECH-MESSEGE', 'server ',socket.username + ' has left this room');
	socket.room = newroom;
	socket.broadcast.to(newroom).emit('TECH-MESSEGE', 'server ',socket.username + ' has joined this room');
	socket.emit('UPDATE_ROOMS', rooms, socket.room);
}

//===========================Модуль извлечения информации о пользователе========================================

function getUserInfo(username, userInfo, socket, io)
{
    let	match = searchStringInArray(username, usersInfo); //поиск совпадений имен в информации о клиентов
		if(match) //если нет совпадения - добавить клиента в список информации о нем
			{
				console.log("Information is already exist");
				// messages_functions.show_mess_to_user(socket, username, io);//показывает историю сообщений

			}
			else
		{
				usersInfo.push(username);
				usersInfo[username] = [];
				usersInfo[username].push(userInfo);
				// messages_functions.show_mess_to_user(socket, username, io);//показывает историю сообщений

		}
}

//===========================Функция удаления перменной из массива данных========================================

function removeValueFromArr(arr, value) {
    for(var i = 0; i < arr.length; i++) {
        if(arr[i] === value) {
            arr.splice(i, 1);
            break;
        }
    }
    return arr;
}

//===========================Функция поиска вхождения строки  в массиве========================================
function searchStringInArray (str, strArray) {
    return strArray.find( (el)=> {return el === str} )
    return 1;
}
function makeHash(length) {
	var result           = '';
	var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	var charactersLength = characters.length;
	for ( var i = 0; i < length; i++ ) {
	   result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
 }