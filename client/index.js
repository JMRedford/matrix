//swap these for local test - heroku deploy
var webSock = new WebSocket('ws://mvp-mks18-redford.herokuapp.com');
//var webSock = new WebSocket('ws://127.0.0.1:3000')


var NUM_COLS = Math.floor(window.innerWidth/16);
var NUM_ROWS = Math.floor(window.innerHeight/22);
var sockOpen = false;
var columnArray = [];
var pId = -1;
var playerLoc = [10,10];

window.onload = function(){
  for (var i = 0; i < NUM_COLS; i++){
    columnArray.push({
      characterDomContainer: $('<div>').addClass('column').appendTo(document.body),
      characters:[],
      current:0,
      filledOnce:false
    });
  }  
}

window.onkeydown = function(e){
  var respObj = {32:'space',37:'a',38:'w',39:'d',40:'s'}
  if (sockOpen && respObj[e.keyCode] && screenFilledOnce()){
    webSock.send(JSON.stringify({'key':respObj[e.keyCode], 'pId':pId}));
  }
};

webSock.onerror = function(err){
  console.log(err);
};

webSock.onopen = function (event) {
  sockOpen = true;
  console.log('socket open'); 
};

webSock.onmessage = function(e){
  try{
    var data = JSON.parse(e.data);
    switch (data.command){
      case 'setId':
        pId = data.theId;
        break;
      case 'startGame':
        NUM_ROWS++;
        playerLoc = data.loc;
        screenDraw(data.board,playerLoc[0],playerLoc[1]);
        break;
      case 'update':
        playerLoc = data.loc;
        screenDraw(data.board,data.loc[0],data.loc[1]);
        break;
    }
  } catch (err){
    introScreen(e);
  }
};

var introScreen = function(e){
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

var setScreen = function(r,c,what){
  columnArray[c].characters[r].html(what);
};

var screenDraw = function(board, playerx, playery){
  var startCol = Math.min(Math.max(Math.floor(playerx - NUM_COLS/2),0),Math.floor(100-NUM_COLS));
  var startRow = Math.min(Math.max(Math.floor(playery - NUM_ROWS/2),0),Math.floor(100- NUM_ROWS));
  var row = 0;
  var col = 0;
  for (var i = 0; i < NUM_ROWS; i++){
    row = i + startRow;
    for (var j = 0; j < NUM_COLS; j++){
      col = j + startCol;
      if (board[col][row] === 'N') console.log('printing player at: '+row+' : '+col);
      setScreen(i,j,board[col][row]);
    }
  }
};

var screenFilledOnce = function(){
  var retBool = true;
  for (var i = 0; i < columnArray.length; i++){
    if (!columnArray[i].filledOnce) retBool = false;
  }
  return retBool;
}