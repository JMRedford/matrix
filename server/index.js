var express = require('express');
var app = express();
var expressWs = require('express-ws')(app);
var gameHandler = require('./gameHandler');

app.use(express.static(__dirname+ '/../client'));
 
app.get('/', function(req, res, next){
  res.render('index.html');
});
 
app.ws('/', function(ws, req) {
  
  gameHandler.makePlayer(ws);
  ws.on('message', gameHandler.handleMsg(msg)); 

  // numPlayers++;
  // playerArray.push({'id': numPlayers, 'conn': ws });

  // ws.on('message', function(msg) {
  //   console.log(msg);
  //   gameHandler.handleMsg(msg);
  // });
  console.log('socket endpoint reached');
});

app.listen(process.env.PORT || 3000);