var express = require('express');
var http = require('http');

var port = 3000;

var app = express();
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/public/index.html');
});

app.get('/practice', function(req, res){
  res.sendFile(__dirname + '/public/practice.html');
});

app.get('/play', function(req, res){
  res.sendFile(__dirname + '/public/play.html');
});

app.get('/contact', function(req, res){
  res.sendFile(__dirname + '/public/contact.html');
});

var server = app.listen(port, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Listening on port', port);
});