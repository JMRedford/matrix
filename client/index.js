
var webSock = new WebSocket('ws://mvp-mks18-redford.herokuapp.com');
//var webSock = new WebSocket('ws://127.0.0.1:3000')


var NUM_COLS = Math.floor(window.innerWidth/16);
var NUM_ROWS = Math.floor(window.innerHeight/18);
var columnArray = [];

window.onload = function(){
  console.log('document loaded, making columns');
  for (var i = 0; i < NUM_COLS; i++){
    columnArray.push({
      characterDomContainer: $('<div>').addClass('column').appendTo(document.body),
      characters:[],
      current:0,
      filledOnce:false
    });
  }  
}


webSock.onerror = function(err){
  console.log(err);
};

webSock.onopen = function (event) {
  console.log('socket open'); 
};

webSock.onmessage = function(e){

  var n = Math.floor(Math.random()*NUM_COLS);
  if (!columnArray[n].filledOnce){
    var newDiv = $('<div>').html(e.data);
    newDiv.appendTo(columnArray[n].characterDomContainer);
    columnArray[n].characters.push(newDiv);
    columnArray[n].current++;
    if (columnArray[n].current > NUM_ROWS){
      columnArray[n].filledOnce = true;
      columnArray[n].current = 0;
    }
  } else {
    if (columnArray[n].current < NUM_ROWS){
      columnArray[n].characters[columnArray[n].current].remove()
      var newTag = $('<div>').html(e.data);
      columnArray[n].characters[columnArray[n].current+1].before(newTag);
      columnArray[n].characters[columnArray[n].current] = newTag;
    }

    columnArray[n].characters[columnArray[n].current].html(e.data);
    columnArray[n].current++;
    if (columnArray[n].current > NUM_ROWS) {
      columnArray[n].current = 0;
    }
  }
};
