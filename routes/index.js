module.exports = function (app, dirname) {

	const bodyParser = 			require("body-parser");
	const urlencodedParser = 	bodyParser.urlencoded({extended: false});

//===========================Функция добавления разрешения на кросдоменные запросы========================================
	app.use((req, res, next) => { //
		res.header('Access-Control-Allow-Origin', '*'); 
		res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
		next();
	
		app.options('*', (req, res) => {
			// allowed XHR methods  
			res.header('Access-Control-Allow-Methods', 'GET, PATCH, PUT, POST, DELETE, OPTIONS');
			res.send();
		});
	});

//===========================Роутинг для тестов, в дальнейшем будет полностью удален========================================
		app.get('/', urlencodedParser, function(request, respons) { //клиентская часть
		// respons.setHeader('Access-Control-Allow-Origin', '*');
		// respons.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');

		respons.sendFile(dirname + '/public/index.html');
	});

};