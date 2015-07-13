
var webSock = new WebSocket('ws://mvp-mks18-redford.herokuapp.com');

webSock.onerror = function(err){
  console.log(err);
};

webSock.onopen = function (event) {
  console.log('sending message from client to server');
  webSock.send("Message from client to server"); 
};

webSock.onmessage = function(e){
  console.log(e.data);
};