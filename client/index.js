
//var webSock = new WebSocket('ws://mvp-mks18-redford.herokuapp.com');
var webSock = new WebSocket('ws://127.0.0.1:3000')


var NUM_COLS = 40;
var columnArray = [];

window.onload = function(){
  console.log('document loaded, making columns');
  for (var i = 0; i < NUM_COLS; i++){
    columnArray.push($('<div>').addClass('column').appendTo(document.body));

    console.log(columnArray[i]);
  }  
}


webSock.onerror = function(err){
  console.log(err);
};

webSock.onopen = function (event) {
  console.log('sending message from client to server');
  webSock.send("Message from client to server"); 
};

webSock.onmessage = function(e){
  console.log(e.data);
  var newDiv = $('<div>').html(e.data);
  var n = Math.floor(Math.random()*NUM_COLS);
  newDiv.appendTo(columnArray[n]);
};