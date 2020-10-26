var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
bodyParser = require('body-parser'),
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))


  
var routes = require("./routes")(app, __dirname); //находится в папке routes в файле index.js

	// const newsJSON = require(__dirname + '/admins/index.json');

// Отслеживание порта
server.listen(3000); //к примеру для входа используется localhost:3000
//===========================******************========================================

//Глобальные Массивы со всеми подключениями
var usernames = {}; //массив с именами пользователей
var rooms = ['lobby']; //массив  с комнатами, по умолчанию при входе в приложение будет кидать в Лобби
var roomsHistory = []//первый элемент с именем комнаты, второй = архив сообщений. История сообщений по сути
var usersInfo = [];
try{
	workWithSockets(); //основная серверная часть со всеми операциями
}
catch(exception)
{
	console.log("error" + exception);
}
//===========================******************========================================

function workWithSockets()
{
// Событие подключения к серверу
	io.sockets.on('connection', function(socket) {
		console.log("Успешное соединение");
		// слушатель события "новый пользователь"
		addUser(socket);
	//===========================******************========================================
		// слушатель события "создание комнаты"
		createRoom(socket);
	//===========================******************========================================
		// слушатель события "удаление комнаты"
		deleteRoom(socket);
		//===========================******************========================================
		// слушатель события "смена комнаты"
		switchRoom(socket);
		//===========================******************========================================
		// // слушатель события "передача сообщения на сервер"
		toServerMess(socket);
		//===========================******************========================================
		// слушатель события "отключение"
		disconnect(socket);
		//===========================******************========================================
	});
}
function addUser(socket)
{
	socket.on('ADD_USER', function(username,userInfo) {
		socket.username = username;
		socket.room = username;
		createRoomByServer(socket,username);
		switchRoomByServer(socket, username);
		usernames[username] = username;
		//socket.join('lobby'); //по умолчанию подключается к комнате Lobby
		//socket.emit('TECH-MESSEGE', 'server', 'you <b>' + username +'</b> have connected to chat');  //отправка сообщения об успешном подключении к чату
		socket.broadcast.to(socket.room).emit('TECH-MESSEGE', 'server ',socket.username + ' has connected to this room');//отправка сообщения юзерам данной комнаты о новом сочатчанине
		socket.emit('UPDATE_ROOMS', rooms, username);
		console.log( username + " connected to the " + socket.room +" room");//сообщение о подключении юзера в консоль
		getUserInfo(username,userInfo); //отправляет объект userInfo на хранение на сервер
	});
}
function getUserInfo(username,userInfo)
{
	let	match = searchStringInArray(username, usersInfo); //поиск совпадений имен в информации о клиентов
		if(match==-1) //если нет совпадения - добавить клиента в список информации о нем
			{
				usersInfo.push(username);
				usersInfo[username] = [];
				usersInfo[username].push(userInfo);
			}
			else
			{
				console.log("Information is already exist");
			}

}
function createRoomByServer(socket, roomName)
{		
		var	match = searchStringInArray(roomName, rooms); //поиск совпадений комнат
		if(match==-1) //если нет совпадения - добавить комнату в список комнат
			{
				rooms.push(roomName); //добавляет элемент в начало массива
				roomsHistory.push(roomName);
				roomsHistory[roomName] = [];
				
				io.sockets.emit('UPDATE_ROOMS', rooms, socket.room);  //вызов в index.html
			}
		else
			{
				console.log("Комната с таким именем уже существует");
			}
		
}

function switchRoomByServer(socket, newroom)
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
function createRoom(socket)
{
	socket.on('CREATE_ROOM', function(room) { //функция для создания комнаты
		rooms.push(room);
		io.sockets.emit('UPDATE_ROOMS', rooms, socket.room);  //вызов в index.html
	});
}
function deleteRoom(socket)//функция удаления комнаты
{
	socket.on("DETELE_ROOM", function(room) {
		removeValueFromArr(rooms, room);
		io.sockets.emit('UPDATE_ROOMS', rooms, socket.room);  //вызов в index.html

	});
}
function switchRoom(socket)
{
	socket.on('SWITCH_ROOM', function(newroom) { //функция для изменения текущей комнаты
		var oldroom;
		oldroom = socket.room;
		socket.leave(socket.room);
		socket.join(newroom);
		socket.emit('TECH-MESSEGE', 'server', 'you have left room ' + oldroom);
		socket.emit('TECH-MESSEGE', 'server', 'you have connected to ' + newroom + " room");
		socket.broadcast.to(oldroom).emit('TECH-MESSEGE', 'server ',socket.username + ' has left this room');
		socket.room = newroom;
		socket.broadcast.to(newroom).emit('TECH-MESSEGE', 'server ',socket.username + ' has joined this room');
		socket.emit('UPDATE_ROOMS', rooms, newroom);
		showMessagesHistory(socket);//показывает историю сообщений
		socket.emit('USER-INFO',usersInfo[newroom]);
	});
}
function showMessagesHistory(socket) //показывает историю сообщений
{
	if(roomsHistory[socket.room]){	
		roomsHistory[socket.room].forEach(element => { //получить массив сообщений от юзера в данной комнате
			io.sockets["in"](socket.room).emit('TO_CHAT_MESS', {
				mess: element, 
				name: '', 
			});
		});
	}
}
function toServerMess(socket)
{
	socket.on('TO_SERVER_MESS', function(data) { 
		// Внутри функции мы передаем событие 'add mess',
		// которое будет вызвано у всех пользователей в ТЕКУЩЕЙ КОМНАТЕ и у них добавится новое сообщение 
		removeValueFromArr(rooms, data.name);
		rooms.unshift(data.name); //ставит комнату в самый верх списка комнат
		io.sockets.emit('UPDATE_ROOMS', rooms, data.current_room);
		addMessageToHistory(data.current_room, data.name, data.mess);//добавит сообщение в историю
		io.sockets["in"](data.current_room).emit('TO_CHAT_MESS', {
			mess: data.mess, 
			name: data.name, 
		});
	});
}
function addMessageToHistory(room_name, name, message)
{
	try {
		roomsHistory[room_name].push(name + " : "+ message);
	} catch (error) {
		
	}
}
function disconnect(socket)
{
	socket.on('disconnect', function(data) {
		console.log("Отключились");
	});
}

function searchStringInArray (str, strArray) {
    for (var j=0; j<strArray.length; j++) {
        if (strArray[j]==(str)) return j;
    }
    return -1;
}
function removeValueFromArr(arr, value) {
    for(var i = 0; i < arr.length; i++) {
        if(arr[i] === value) {
            arr.splice(i, 1);
            break;
        }
    }
    return arr;
}