var express = require('express');
var http = require('http');

var port = 3000;

var app = express();
app.use(express.static(__dirname + '/client'));


app.get('/practice', function(req, res, next){
  res.sendFile(__dirname + '/client/practice.html');
});

app.get('/play', function(req, res, next){
  res.sendFile(__dirname + '/client/play.html');
});

app.get('/contact', function(req, res, next){
  res.sendFile(__dirname + '/client/contact.html');
});

var server = app.listen(port, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Listening on port', port);
});