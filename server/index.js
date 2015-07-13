var express = require('express');
var app = express();
var expressWs = require('express-ws')(app);

app.use(express.static(__dirname+ '/../client'));

app.use(function (req, res, next) {
  console.log('middleware');
  req.testing = 'testing';
  return next();
});
 
app.get('/', function(req, res, next){
  console.log('got get on root');
  res.render('index.html');
});
 
app.ws('/', function(ws, req) {
  ws.on('message', function(msg) {
    console.log(msg);
  });
  setInterval(function(){
    sendRandomCharacter(ws);
  },500)
  console.log('socket endpoint reached');
});

var sendRandomCharacter = function(ws){
  console.log('attempting to send random character')
  var randNumber = Math.floor(Math.random()*32) +64;
  var sendData = '&#'+randNumber;
  ws.send(sendData);
};

 
app.listen(process.env.PORT || 3000);