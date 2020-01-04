## Введение
Функционал и работа чата в основном просты. Для запуска необходим <b>npm</b><br/>
Запускаем <b>npm start</b> <br/>
Для входа в панель клиента идем по пути localhost:3000
<br/>
Любые другие роуты дадут ошибку. <br/>
Основной код nodejs стоит в index.js. Везде вставил комментарии для более удобного чтения кода<br/>

## НАСТОЯТЕЛЬНО РЕКОМЕНДУЕТСЯ!!
запустить команды composer install и composer.update так как в процессе разработки постоянно добавляются и удаляются библиотеки и модули!
## Работа авторизации админов(временно добавлено в readme, в дальнейшем подлежит удалению из Readme)
В основной странице в самом верху есть форма, заполнив которую система сообщит об успешной авторизации, либо же скажет что введенные данные <b>НЕВЕРНЫЕ</b>. <br/> 
Валидация на стороне сервера не проведена так как лучше если это будет сделано через фронт часть.<br/> 
Авторизация проводится в формате AJAX поэтому перезагрузки страницы как таковой вы не увидете. Все работает быстро. <br/>
В 26 строчке по пути routes.index.js прописан код <i><b>request.body.userpass="";</b></i> который стирает введенный пароль для хоть какой-то защиты паролей админов (в дальнейшем подлежит модернизации).

## Расположение элементов в index.js :

Краткий обзор по локации тех или иных функций и переменных , для удобства буду указывать номера строчек<br/>
Путь routes/index.js - роутинг<br/>
Путь admins/index.json - файл содержащий имена и пароли администраторов
36-39 глобальные переменные<br/>
23 - вызов основной функции io для основной работы<br/>
31 - сама функция<br/>
53 - функция adduser в позиции on<br/>
66 - функция create в позиции on<br/>
73 - функция switchRoom в позиции on<br/>
88 - функция disconnect в позиции on<br/>
99 - функция send mess в позиции on<br/>

##  index.html 
Опишу основные роуты - основной код начинается с 72й строчки.<br/>
Ну и соответственно во время чата все будет крутиться вокруг них. Больше знать не обязательно <br/>
Форма для авторизации админа - 26 строчка <br/>
Функция обрабатывающая авторизацию админа в формате AJAX - 161 строчка <br/>
## описаниие событий

ADD_USER - создание  нового канала и добавление нового пользователя<br/>

TECH-MESSEGE - техничеое сообщение от сервера <br/>
TO_SERVER_MESS - отправка сообщений на сервер<br/>
TO_CHAT_MESS - отправка сообщений в чат<br/>

UPDATE_ROOMS - обновить список комнат<br/>
CREATE_ROOM  - создать новую комнату<br/>
SWITCH_ROOM - сменить комнату<br/>
## Маршруты (New)
'/' - гетовый маршрут основной  страницы <br/>
'/admins/auth' - постовый маршрут авторизации админа <br/>
'/admin' - работает но временно не нужен вообще <br/>
'*' - показывает ошибку в случае если вы ошиблись вводом маршрута <br/>
