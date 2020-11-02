var chai = require('chai');
var should = chai.should();
var io = require('socket.io-client');
const socketURL = "http://localhost:7143/"
let some_room_id = ""

describe("Socket-Server", function () {
  it('2 user should be connected to sockets and start conversation.', function (done) {
      let client1_info = {
          userName:"Some name",
          hash: "Some hash"
      }
      let client2_info = {
        userName:"Some another",
        hash: "Some another hash"
    }
    var client = io(socketURL);
    var client2 = io(socketURL)
    add_user(client1_info, client)
    add_user(client2_info, client2)
    start_conversation(client, client1_info, client2_info)
    if(some_room_id==="") setTimeout(()=>{
        console.log(some_room_id)
        switch_room(some_room_id, client)
        console.log(some_room_id)
        switch_room(some_room_id, client2)
        console.log(some_room_id)
    
        for(let i = 0 ; i < 10; i++){
            send_mess(client1_info, client)
            send_mess(client2_info, client2)    
        }
        
        done()
    }, 150)
    
  });
});
function start_conversation(socket, user1, user2){
  
    socket.emit("START_CONVERSATION", user1.userName,  user2.userName)
    socket.on("CONVERSATION_STARTED", (roomId)=>{
        some_room_id = roomId
        console.log(roomId)      
    })
}
function send_mess(info, socket){
    let send_datas = {
        author: info.userName,
        current_room_id:some_room_id,
        message:makeHash(15),
        request:makeHash(15),
        time:new Date().toLocaleString(),
        current_room:some_room_id
      }
    socket.emit("TO_SERVER_MESS", send_datas)
}
function add_user(info, socket){
    socket.emit("ADD_USER", info.userName, info.hash)
    socket.on("TECH-MESSEGE", (...msg)=>{
        console.log(msg)
    })
    socket.on("TO_CHAT_MESS", (msg)=>{
        console.log(`Message by ${info.userName} `,msg)
    })
}
function switch_room(roomId, socket){
    socket.emit("SWITCH_ROOM", roomId)
}
function makeHash(length) {
	var result           = '';
	var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	var charactersLength = characters.length;
	for ( var i = 0; i < length; i++ ) {
	   result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
 }