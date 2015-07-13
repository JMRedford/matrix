
var webSock = new WebSocket('ws://127.0.0.1:3000/');

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