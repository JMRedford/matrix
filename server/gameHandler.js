
module.exports = {
  playerArray: [],
  pIdCount: 0,
  worldWidth: 100,
  worldHeight: 100,
  players: {},
  attacks: [],

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
    this.players[this.pIdCount] = {'conn':ws, 'started':false, 'direction':'w', 'animatingframes':0};
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
        case 'space':
          switch(p.direction){
            case 'a':
              if (p.loc[0]>0){
                this.gameBoard[p.loc[0]-1][p.loc[1]] = '-';
                this.attacks.push({
                  'loc':[p.loc[0]-1,p.loc[1]],
                  'frames':0
                });
              }
              break;
            case 's':
              if (p.loc[1]<98){
                this.gameBoard[p.loc[0]][p.loc[1]+1] = '|';
                this.attacks.push({
                  'loc':[p.loc[0],p.loc[1]+1],
                  'frames':0
                });
              }
              break;
            case 'd':
              if (p.loc[0]<98){
                this.gameBoard[p.loc[0]+1][p.loc[1]] = '-';
                this.attacks.push({
                  'loc':[p.loc[0]+1,p.loc[1]],
                  'frames':0
                });
              }
              break;
            case 'w':
              if (p.loc[1]>0){
                this.gameBoard[p.loc[0]][p.loc[1]-1] = '|';
                this.attacks.push({
                  'loc':[p.loc[0],p.loc[1]-1],
                  'frames':0
                });
              }
              break;
          }
          break;
        case 'w':
          if (p.loc[1]>0 && this.gameBoard[p.loc[0]][p.loc[1]-1] === ' '){
            this.gameBoard[p.loc[0]][p.loc[1]] = ' ';
            this.gameBoard[p.loc[0]][p.loc[1]-1] = 'N'
            p.loc = [p.loc[0],p.loc[1]-1];
            p.direction = 'w';
          }
          break;
        case 'd':
          if (p.loc[0]<99 && this.gameBoard[p.loc[0]+1][p.loc[1]] === ' '){
            this.gameBoard[p.loc[0]][p.loc[1]] = ' ';
            this.gameBoard[p.loc[0]+1][p.loc[1]] = 'N';
            p.loc = [p.loc[0]+1,p.loc[1]];
            p.direction = 'd';
          }
          break;
        case 's':
          if (p.loc[1]<99 && this.gameBoard[p.loc[0]][p.loc[1]+1] === ' '){
            this.gameBoard[p.loc[0]][p.loc[1]] = ' ';
            this.gameBoard[p.loc[0]][p.loc[1]+1] = 'N';
            p.loc = [p.loc[0],p.loc[1]+1];
            p.direction = 's';
          }
          break;
        case 'a':
          if (p.loc[0]>0 && this.gameBoard[p.loc[0]-1][p.loc[1]] === ' '){
            this.gameBoard[p.loc[0]][p.loc[1]] = ' ';
            this.gameBoard[p.loc[0]-1][p.loc[1]] = 'N';
            p.loc = [p.loc[0]-1,p.loc[1]];
            p.direction = 'a';
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

  updateBoard: function(){
    var toRemove = [];
    for (var i = 0;i < this.attacks.length;i++){
      this.attacks[i].frames++;
      if (this.attacks[i].frames > 3){
        toRemove.push(i);
      }
    }
    for (var i = 0;i < toRemove.length;i++){
      var loc = this.attacks[toRemove[i]-i].loc;
      this.gameBoard[loc[0]][loc[1]] = ' ';
      this.attacks.splice(toRemove[i]-i,1);
    }
  },

  sendGameState: function(ws,loc){
    try{
      ws.send(JSON.stringify({'command':'update', 'board':this.gameBoard, 'loc':loc}));
    } catch(err){}
  }
}