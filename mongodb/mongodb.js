 //===========================Входные данные========================================
 const user =           "db33ee0f23395f4a844c799146bb9a82";
 const dbName =         "db33ee0f23395f4a844c799146bb9a82";
 const hostString =     "9a.mongo.evennode.com:27017/db33ee0f23395f4a844c799146bb9a82";
 const mongoPassword =  "Otdyhaem123";
 const replica =        "?replicaSet=eu-9";
 //===========================Конец входных данных========================================

 
 //===========================Получение рабочего Url для соединения с Mongodb========================================
exports.getConnectionUrl = function(url) {
 url = "mongodb://" + user + ":" + encodeURIComponent(mongoPassword) + "@" + //создание рабочего Url
    hostString + replica;
    return url; //возвращаем созданную ссылку для дальнейших подключений
}
//===========================Конец получения рабочего Url========================================



//===========================Конец получения таблицы========================================


//===========================Добавление сообщения в БД========================================
exports.addMessageToDb = function(mongoClient, current_room, role, author, message,request,time, operator)
{

    mongoClient.connect(function (err, client) { //соединение с бд
    new Promise((resolve, reject) => { //объявление обещания колбека, отвечает за точное закрытие соединения с БД после выполнения работы
        const db = client.db(dbName);
        const collection = db.collection("users");
        let msgHistory = { //массив с данными о сообщении
          role:     role, 
          author:   current_room, 
          to_whom:  operator,
          msg:      message, 
          request:  request, 
          time:     time     
        };
        collection.insertOne(msgHistory);//добавление записи
        console.log('Добавлено новое сообщение в бд')
    }).then(() => client.close());;
  });
}
//===========================Конец добавления сообщения в БД========================================

//===========================Модуль для показа истории сообщения Администратору========================================
exports.show_mess_to_admin = function(mongoClient, author, io, socket)
{
  mongoClient.connect(function (err, client) {
    new Promise((resolve, reject) => { //объявление обещания колбека, отвечает за точное закрытие соединения с БД после выполнения работы

    const db = client.db(dbName);
    const collection = db.collection("users");
    if (err)
      return console.log(err);
      collection.find({$or:[
        {author:author},
        {to_whom:author}
         ]}).sort({ time: -1 })
            .toArray(function (err, results) {
                start_sending_msgs(results, author, 'MESS_TO_ADMIN', io);

               });
      }).then(() => client.close());
    });
}
//===========================Конец модуля=======================================================================

//===========================Модуль для показа истории сообщения клиенту========================================

exports.show_mess_to_user = function(mongoClient, author, io, socket) //отправляет сообщения пользователям админу и клиенту
{
  mongoClient.connect(function (err, client) {
      new Promise((resolve, reject) => { //объявление обещания колбека, отвечает за точное закрытие соединения с БД после выполнения работы
        let msgs = [];
      const db = client.db(dbName);
      const collection = db.collection("users");
      if (err)
        return console.log(err);

          collection.find({$or:[ //ищет если автор является автором письма или автор является получателем письма
            {author:author},
            {to_whom:author}
          ]}).sort({ time: -1 })//сортирует в обратном порядке сообщения, ставить 1 если в прямом порядке
            .limit(10)          //ограничение на вывод сообщений
            .toArray(function (err, results) {
                start_sending_msgs(results, author, 'MESS_TO_USER', io); //отправляет сообщение пользователю
            });
      
      }).then(() => client.close()); //выполняем закрытие промиса
  });
}
//===========================Конец модуля========================================


//===========================Функция для показа истории сообщения========================================
function start_sending_msgs(results, author, to_whom, io)
{
  massOfMsgs = [];
  try {
    results.reverse(); //переворачивает полученный массив данных, было 5 4 3 2 1 стало  1 2 3 4 5

  } catch (error) {
    console.log('Текст ошибки');
    console.log(error);
  }
  try{
  results.forEach(element => { //добавление результатов в массив сообщений
     massOfMsgs.push(element);
  });
}
catch{}
try {
  io.sockets["in"](author).emit(to_whom, massOfMsgs);//отправить сообщение в комнату
} 
catch (error) {}
}
//===========================Конец функции========================================

