//===========================Объявление глобальных переменных и библиотек========================================
var express = 			require('express');
var app = 				express();
// var app = require('express');
var server = 			require('http').createServer(app);

var https = require('https');
var fs = require('fs');
// var hskey = fs.readFileSync('sslcert/privkey-1603304997.pem');
// var hscert = fs.readFileSync('sslcert/cert-1603304997.pem')
// var options = {
//   key: hskey,
//   cert: hscert
// };
// var server = https.createServer(options, app);
var io = require('socket.io').listen(server);
const rooms_class = require("./main_functions/support_classes/Room").get_room_class()
io.rooms =  new rooms_class
bodyParser = require('body-parser'),
require("./routes")(app, __dirname); //находится в папке routes в файле index.js
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
const rooms_functions = require("./main_functions/rooms.js"); 
//===========================Конец объявления========================================

server.listen(7143, function () {
  console.log('HTTP Express server is up!');
});
// Отслеживание порта
// server.listen(7143, console.log("чат для сервера запущен")); //к примеру для входа используется localhost:3000
//===========================******************========================================

//Глобальные Массивы со всеми подключениями

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
		// слушатель события "новый пользователь"
		rooms_functions.addUser(socket, io);
	//===========================******************========================================
		// слушатель события "создание комнаты"
		rooms_functions.createRoom(socket, io);
	//===========================******************========================================
		// слушатель события "удаление комнаты"
		rooms_functions.deleteRoom(socket);
		//===========================******************========================================
		// слушатель события "смена комнаты"
		rooms_functions.switchRoom(socket, io);
		//===========================******************========================================
		// // слушатель события "передача сообщения на сервер"
		rooms_functions.toServerMess(socket, io);
		//===========================******************========================================
		// слушатель события "отключение"
		rooms_functions.disconnect(socket);
		//===========================******************========================================
		//слушатель события - получить все диалоги
		rooms_functions.get_all_conversations(socket, io)
		//===========================******************========================================
		//слушатель события - добавить пользователя в общий чат

		rooms_functions.add_user_to_conversation(socket, io)

		rooms_functions.start_conversation(socket, io)
	});
}
