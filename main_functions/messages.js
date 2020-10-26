//===========================Объявление глобальных функций========================================
var 	url;
const 	rooms_functions = 	require("./rooms.js"); 
const 	MongoClient = 		require('mongodb').MongoClient;
const 	MongoDb = 			require("../mongodb/mongodb.js"); //проверка подключения к бд, и получение рабочего Url для дальнейших действий
		url = 				MongoDb.getConnectionUrl(url);//получение url
const 	mongoClient = 		new MongoClient(url,{useUnifiedTopology: true, useNewUrlParser: true}); //соединение с MongoDb и создание переменной для дальнейших действий с БД
//===========================Конец========================================


//===========================Модуль для показа истории сообщения Администратору========================================

exports.show_mess_to_admin = function(socket, author, io)
{
	MongoDb.show_mess_to_admin(mongoClient, author, io, socket);
}
//===========================Конец модуля========================================

//===========================Модуль для показа истории сообщения Клиенту========================================
exports.show_mess_to_user = function(socket, author, io)
{
	MongoDb.show_mess_to_user(mongoClient, author, io, socket);
}
//===========================Конец модуля========================================


//===========================Модуль для добавления сообщения в Базу Данных========================================

exports.addMessageToHistory = function(current_room, role, author, message, request, time,operator)
{
    MongoDb.addMessageToDb(mongoClient, current_room, role, author, message,request,time, operator);//добавляем запись в бд

}
//===========================Конец модуля========================================
