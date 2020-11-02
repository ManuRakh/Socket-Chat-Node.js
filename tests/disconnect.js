var chai = require('chai');
var should = chai.should();
var io = require('socket.io-client');
const socketURL = "http://localhost:7143/"
describe("Socket-Server", function () {
  it('user should be able to disconnect himself.', function (done) {
    var client = io(socketURL);
    client.emit("disconnect")
    
    client.on("disconnected", ()=>{
        console.log("DOES NOT WORKS")
    })
    done()
  });
});
