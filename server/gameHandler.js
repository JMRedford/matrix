
module.exports = {
  playerArray: [],
  pIdCount: 0,
  worldWidth: 100,
  worldHeight: 100,
  players: {},

  gameBoard: [],

  initGameBoard: function(){
    for (var i = 0; i < 100; i++){
      this.gameBoard.push([]);
      for (var j = 0; j < 100; j++){
        this.gameBoard[i].push(' ');
      }
    }  
    for (var i = 0; i < 50; i++){
      this.gameBoard[Math.floor(Math.random()*100)][Math.floor(Math.random()*100)] = 'S';
    }
  },
  //generate an empty game Board
  
  makePlayer: function(ws){
    this.pIdCount++;
    this.players[this.pIdCount] = {'conn':ws, 'started':false};
    ws.send(JSON.stringify({'command':'setId','theId':this.pIdCount}));
    var that = this;
    this.players[this.pIdCount].SendID = setInterval(function(){
      that.sendRandomCharacter(ws,that.pIdCount);
    },2);
  },

  destroyPlayer: function(pId){
    try{
      this.players[pId].conn.close();
      delete this.players[pId];
    } catch (err){}
  },

  handleMsg: function(msg){

    var data = JSON.parse(msg);
    var pId = data.pId;
    var key = data.key;

    if (this.players[pId].started){
      var p = this.players[pId];

      switch (key){
        case 'w':
          if (p.loc[1]>0 && this.gameBoard[p.loc[0]][p.loc[1]-1] === ' '){
            this.gameBoard[p.loc[0]][p.loc[1]] = ' ';
            this.gameBoard[p.loc[0]][p.loc[1]-1] = 'N'
            p.loc = [p.loc[0],p.loc[1]-1];
          }
          break;
        case 'd':
          if (p.loc[0]<99 && this.gameBoard[p.loc[0]+1][p.loc[1]] === ' '){
            this.gameBoard[p.loc[0]][p.loc[1]] = ' ';
            this.gameBoard[p.loc[0]+1][p.loc[1]] = 'N';
            p.loc = [p.loc[0]+1,p.loc[1]];
          }
          break;
        case 's':
          if (p.loc[1]<99 && this.gameBoard[p.loc[0]][p.loc[1]+1] === ' '){
            this.gameBoard[p.loc[0]][p.loc[1]] = ' ';
            this.gameBoard[p.loc[0]][p.loc[1]+1] = 'N';
            p.loc = [p.loc[0],p.loc[1]+1];
          }
          break;
        case 'a':
          if (p.loc[0]>0 && this.gameBoard[p.loc[0]-1][p.loc[1]] === ' '){
            this.gameBoard[p.loc[0]][p.loc[1]] = ' ';
            this.gameBoard[p.loc[0]-1][p.loc[1]] = 'N';
            p.loc = [p.loc[0]-1,p.loc[1]];
          }
          break;
      }
    } else {  
      clearInterval(this.players[pId].SendID);
      var loc = [0,0];
      var locationFound = false;
      while (!locationFound){
        loc = [Math.floor(Math.random()*100),
               Math.floor(Math.random()*100)];        
        if (this.gameBoard[loc[0]][loc[1]] === ' ') {
          locationFound = true;
          this.players[pId].loc = loc;
        }
      }
      this.gameBoard[loc[0]][loc[1]] = 'N';
      this.players[pId].started = true;
      this.players[pId].conn.send(JSON.stringify({
        'command':'startGame',
        'loc':loc,
        'board':this.gameBoard
      }));
      var that = this;
      this.players[pId].SendID = setInterval(function(){
        that.sendGameState(that.players[pId].conn, that.players[pId].loc);
      },25);
    }

  },

  sendRandomCharacter: function(ws, pId){
    var randNumber = Math.floor(Math.random()*83) +12353;
    var sendData = '&#'+randNumber;
    try{
      ws.send(sendData);
    } catch (err) {
      
    }
  },

  sendGameState: function(ws,loc){
    ws.send(JSON.stringify({'command':'update', 'board':this.gameBoard, 'loc':loc}));
  }
}