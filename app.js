const SerialPort = require("serialport");
const request = require('request');

const parser = new  SerialPort.parsers.Readline({delimiter: '\n'});
const parser2 = new  SerialPort.parsers.Readline({delimiter: '\n'});
const parser3 = new  SerialPort.parsers.Readline({delimiter: '\n'});

var portConfig = {
    baudRate: 9600,
    dataBits: 8,
    parity: 'none',
    stopBits: 1,
    flowControl: false
};

var port = new SerialPort('/dev/ttyUSB0', portConfig);
var port2 = new SerialPort('/dev/ttyUSB1', portConfig);
var port3 = new SerialPort('/dev/ttyUSB2', portConfig);
port.pipe(parser);
port2.pipe(parser2);
port3.pipe(parser3);

// trigger when passage request comes from arduino
parser.on('data', function(data) {
    console.log('received: ' + data)

    // send passage request to server
    // response boolean send back to arduino to decide if passage will be approved
    request(
        'http://localhost:8080/arduino-gateway/process/' + data, 
        function(error, response, body) {
            var success = String(body) === 'true';
            console.log(success ? 'Passage approved' : 'Passage not approved');
            // call executed, write boolean response to serial port
            port.write(success ? '1\n' : '0\n');
        })
});

parser2.on('data', function(data) {
    console.log('received: ' + data)

    // send passage request to server
    // response boolean send back to arduino to decide if passage will be approved
    request(
        'http://localhost:8080/arduino-gateway/process/' + data, 
        function(error, response, body) {
            var success = String(body) === 'true';
            console.log(success ? 'Passage approved' : 'Passage not approved');
            // call executed, write boolean response to serial port
            port2.write(success ? '1\n' : '0\n');
        })
});

parser3.on('data', function(data) {
    console.log('received: ' + data)

    // send passage request to server
    // response boolean send back to arduino to decide if passage will be approved
    request(
        'http://localhost:8080/arduino-gateway/process/' + data, 
        function(error, response, body) {
            var success = String(body) === 'true';
            console.log(success ? 'Passage approved' : 'Passage not approved');
            // call executed, write boolean response to serial port
            port3.write(success ? '1\n' : '0\n');
        })
});