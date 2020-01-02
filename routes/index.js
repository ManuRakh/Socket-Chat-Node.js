
module.exports = function (app, dirname) {

app.get('/', function(request, respons) { //клиентская часть
	respons.sendFile(dirname + '/public/index.html');
});
app.get('/admin', function(request, respons) { //админская часть
	respons.sendFile(dirname + '/public/admin.html');
});
app.get('*', function(request, respons) { //админская часть
	respons.sendFile(dirname + '/public/error.html');
});
};