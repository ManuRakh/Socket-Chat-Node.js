var usernames = 			{}; //массив с именами пользователей
var rooms = 				[]; //массив  с комнатами, по умолчанию при входе в приложение будет кидать в Лобби
var usersInfo = 			[];
const messages_functions = 	require("./messages.js"); 
class User {
	constructor(name, id) {
		this.name = name;
		this.id = id;
		this.rooms = [];
		this.owner = true
		this.current_room = {
			roomName:this.name,
			hash:this.id,
			owner:true
		};
		const add_room = ((roomName) => {
			this.rooms.push({ roomName: roomName, hash: id, owner:false });
		});
		const get_user_rooms = (() => {
			return this.rooms;
		});
		const get_all_infos = (() => {
			return { name: this.name, id: this.id, rooms: this.rooms };
		});
		const change_current_room = ((new_room) => {
			this.current_room = new_room;
		});
		const remove_room = ((roomId) => {
			console.log(roomId)
			this.rooms = this.rooms.filter((r) => r.hash != roomId);
			console.log(this.rooms)
		});
		const get_current_room = (()=>{
			return this.current_room
		})
		return {
			add_room,
			get_user_rooms,
			get_all_infos,
			change_current_room,
			remove_room,
			get_current_room
		};
	}
}
class Message {
	constructor(message, room) {
		this.messages = message;
		this.room = room;
		const get_rooms_and_messages = (() => {
			return { room: this.room, messages: this.messages };
		});
		return {
			get_rooms_and_messages
		};
	}
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
exports.deleteRoom = function(socket)
{
    socket.on("DETELE_ROOM", function(room) {
		// messages_functions.removeValueFromArr(rooms, room);
		io.sockets.emit('UPDATE_ROOMS', rooms, socket.room);  //обновляет комнаты после удаления оной
		socket.emit('CLEAN_CHAT');
	});
}

//===========================Модуль Создает комнату========================================
exports.createRoom = function(socket)
{
    socket.on('CREATE_ROOM', function(room) { //функция для создания комнаты
		rooms.push(room);
		io.sockets.emit('UPDATE_ROOMS', rooms, socket.room);  //вызов в index.html
	});
}

//===========================Модуль добавляет пользователя в сеть========================================

exports.addUser = function(socket, io)
{
    socket.on('ADD_USER', async (username,userInfo) => {
        socket.username = username;
		socket.room = username; 
		// socket.join(username)
		let user = new User(username, makeHash(15))//id генерируется либо из бд по айди юзера, либо рандомно, пока что рандомно
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

//===========================Модуль отправки сообщения на сервер========================================
exports.toServerMess = function(socket, io)
{
	
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
			console.log(socket.room)
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