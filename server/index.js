var express = require('express');
var app = express();
var expressWs = require('express-ws')(app);
var gameHandler = require('./gameHandler');
var randCharIntervalID;

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
    gameHandler(msg);
    clearInterval(randCharIntervalID);
  });
  randCharIntervalID = setInterval(function(){
    sendRandomCharacter(ws);
  },1)
  console.log('socket endpoint reached');
});

var sendRandomCharacter = function(ws){
  var randNumber = Math.floor(Math.random()*83) +12353;
  var sendData = '&#'+randNumber;
  try{
  ws.send(sendData);
  } catch (err) {
    clearInterval(randCharIntervalID);
  }
};

 
app.listen(process.env.PORT || 3000);