var chai = require('chai');
var should = chai.should();
var io = require('socket.io-client');
const socketURL = "http://localhost:7143/"
describe("Socket-Server", function () {
  it('user should be able to start conversation.', function (done) {
    var client = io(socketURL);
    client.emit("START_CONVERSATION", "123a", "123b")
    client.on("CONVERSATION_STARTED", (roomName, author_id, conv_id)=>{
                        done()
    })
  });
});
