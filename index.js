var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);


// Отслеживание порта
server.listen(3000); //к примеру для входа используется localhost:3000
//Роутинг
app.get('/', function(request, respons) { //клиентская часть
	respons.sendFile(__dirname + '/public/index.html');
});
app.get('/admin', function(request, respons) { //админская часть
	respons.sendFile(__dirname + '/public/admin.html');
});
app.get('*', function(request, respons) { //админская часть
	respons.sendFile(__dirname + '/public/error.html');
});
//===========================******************========================================

//Глобальные Массивы со всеми подключениями
var usernames = {}; //массив с именами пользователей
var rooms = ['lobby']; //массив  с комнатами, по умолчанию при входе в приложение будет кидать в Лобби
try{
	workWithSockets(); //основная серверная часть со всеми операциями
}
catch(exception)
{
	console.log("error");
}
//===========================******************========================================

function workWithSockets()
{
// Событие подключения к серверу
	io.sockets.on('connection', function(socket) {
		console.log("Успешное соединение");
	// слушатель события "новый пользователь"
		socket.on('ADD_USER', function(username) {
			socket.username = username;
			socket.room = 'lobby';
			usernames[username] = username;
			socket.join('lobby'); //по умолчанию подключается к комнате Lobby
			socket.emit('TECH-MESSEGE', 'server', 'you have connected to lobby');  //отправка сообщения об успешном подключении к чату
			socket.broadcast.to('lobby').emit('TECH-MESSEGE', 'server ',socket.username + ' has connected to this room');//отправка сообщения юзерам данной комнаты о новом сочатчанине
			socket.emit('UPDATE_ROOMS', rooms, 'lobby');
			console.log( username + " connected to the " + socket.room);//сообщение о подключении юзера в консоль
		});
	//===========================******************========================================

		// слушатель события "создание комнаты"
		socket.on('CREATE_ROOM', function(room) { //функция для создания комнаты
			rooms.push(room);
			io.sockets.emit('UPDATE_ROOMS', rooms, socket.room);  //вызов в index.html
		});
		//===========================******************========================================

		// слушатель события "смена комнаты"
		socket.on('SWITCH_ROOM', function(newroom) { //функция для изменения текущей комнаты
			var oldroom;
			oldroom = socket.room;
			socket.leave(socket.room);
			socket.join(newroom);
			socket.emit('TECH-MESSEGE', 'server', 'you have left room ' + oldroom);
			socket.emit('TECH-MESSEGE', 'server', 'you have connected to ' + newroom);
			socket.broadcast.to(oldroom).emit('TECH-MESSEGE', 'server ',socket.username + ' has left this room');
			socket.room = newroom;
			socket.broadcast.to(newroom).emit('TECH-MESSEGE', 'server ',socket.username + ' has joined this room');
			socket.emit('UPDATE_ROOMS', rooms, newroom);
		});
		//===========================******************========================================

		// // слушатель события "передача сообщения на сервер"
		socket.on('TO_SERVER_MESS', function(data) { 
			// Внутри функции мы передаем событие 'add mess',
			// которое будет вызвано у всех пользователей в ТЕКУЩЕЙ КОМНАТЕ и у них добавится новое сообщение 
			io.sockets["in"](socket.room).emit('TO_CHAT_MESS', {
				mess: data.mess, 
				name: data.name, 
			});
		});
		//===========================******************========================================

		// слушатель события "отключение"
		socket.on('disconnect', function(data) {
			console.log("Отключились");
		});
		//===========================******************========================================
	});
}