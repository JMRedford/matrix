
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
  },
  //generate an empty game Board
  
  makePlayer: function(ws){
    this.pIdCount++;
    this.players[this.pIdCount] = {'conn':ws};
    ws.send({'command':'setId','theId':this.pIdCount});
    var that = this;
    this.players[this.pIdCount].randSendID = setInterval(function(){
      that.sendRandomCharacter(ws,that.pIdCount);
    },1);
  },

  destroyPlayer: function(pId){
    this.players[pId].conn.end();
    delete this.players[pId];
  },

  handleMsg: function(msg){
    var pId = msg.data.pId;
    if (this.players[pId].randSendID){
      clearInterval(this.players[pId].randSendID);
      delete this.players[pId.randSendID];
    }
  },

  sendRandomCharacter: function(ws, pId){
    var randNumber = Math.floor(Math.random()*83) +12353;
    var sendData = '&#'+randNumber;
    try{
      ws.send(sendData);
    } catch (err) {
      this.destroyPlayer(pId);
    }
  }
}