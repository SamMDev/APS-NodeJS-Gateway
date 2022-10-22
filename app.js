const SerialPort = require("serialport");
const request = require('request');

const parser = new  SerialPort.parsers.Readline({delimiter: '\n'});

var portConfig = {
    baudRate: 9600,
    dataBits: 8,
    parity: 'none',
    stopBits: 1,
    flowControl: false
};

var port = new SerialPort('/dev/ttyUSB0', portConfig);
port.pipe(parser);

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