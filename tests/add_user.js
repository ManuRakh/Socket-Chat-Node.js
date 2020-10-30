var chai = require('chai');
var should = chai.should();
var io = require('socket.io-client');
const socketURL = "http://localhost:7143/"
describe("Socket-Server", function () {
  it('user should be able to add himself.', function (done) {
    var client = io(socketURL);
    client.emit("ADD_USER", "Manu", "JHHHFDISHUHUIHFIUHDF")
    client.on("SUCCESS_CONNECTED", ()=>{
        done()
    })
  });
});
