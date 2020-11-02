var chai = require('chai');
var should = chai.should();
var io = require('socket.io-client');
const socketURL = "http://localhost:7143/"
describe("Socket-Server", function () {
  it('user should be able to switch room.', function (done) {
    var client = io(socketURL);
    let author_id = "hjhkjfgndjjh"
    let conversationer_id = "uriegjgdlgdkfkjg"
    client.emit("SWITCH_ROOM", "some_id1")//where/ from whom, who is switcher
    client.on("TECH-MESSEGE", (msg, msg2)=>{
        console.log(msg2)
    })
    client.emit("SWITCH_ROOM", "some_id2")//where/ from whom, who is switcher
    client.on("TECH-MESSEGE", (msg, msg2)=>{
        console.log(msg2)
    })
    done()
  });
});
