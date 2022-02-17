
const advlib = require('advlib-ble');

const LIBRARIES = [
    require('advlib-ble-services'),
    require('advlib-ble-manufacturers')
];


module.exports = function (RED) {

    function redAdvlibBle(config) {
        RED.nodes.createNode(this, config);
        const ignoreProtocolOverheadCheckbox = config.ignoreProtocolOverheadCheckbox;
        var node = this;
        node.on('input', function (msg) {
            let packet = msg.payload.data;
            let options = { ignoreProtocolOverhead: ignoreProtocolOverheadCheckbox };
            let processedPacket = advlib.process(packet, LIBRARIES, options);
            msg.payload.advDecoded = processedPacket;
            node.send(msg);
        });
    }
    RED.nodes.registerType("red-advlib-ble", redAdvlibBle);
}