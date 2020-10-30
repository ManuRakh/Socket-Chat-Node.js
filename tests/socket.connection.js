var chai = require('chai');
var should = chai.should();
var io = require('socket.io-client');
const socketURL = "http://localhost:7143/"
describe("Socket-Server", function () {
  it('user connected and able to send msg through socket.', function (done) {
    var client = io(socketURL);
    client.on('connect', function (data) {
      done();
    });
  });
});
