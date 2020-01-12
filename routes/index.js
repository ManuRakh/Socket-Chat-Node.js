
module.exports = function (app, dirname) {
	const bodyParser = require("body-parser");
	const urlencodedParser = bodyParser.urlencoded({extended: false});

	app.get('/', urlencodedParser, function(request, respons) { //клиентская часть
		respons.sendFile(dirname + '/public/index.html');
	});

	app.post('/admins/auth', urlencodedParser, function(request, response) { //для авторизации админа
			var authorized = false;
			const adminsJson = require(dirname + '/admins/index.json');
			adminsJson.admins.forEach(element => {
			if(element.name == request.body.userName)
				{
					if(element.pass == request.body.userpass)
					{
						authorized=true;
					}
				}
			});
			request.body.authorized = authorized;
			//console.log(request.body.userpass);
			request.body.userpass="";
		    response.json(request.body); // отправляем пришедший ответ обратно
		
		});

	app.get('/admin', function(request, respons) { //админская часть
		respons.sendFile(dirname + '/public/admin.html');
	});

	app.get('*', function(request, respons) { //админская часть
		respons.sendFile(dirname + '/public/error.html');
	});
};