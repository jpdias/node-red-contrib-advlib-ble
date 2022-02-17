
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
            try {
                let processedPacket = advlib.process(packet, LIBRARIES, options);
                msg.payload.advDecoded = processedPacket;
                this.status({ fill: "green", shape: "dot", text: "ok" });
                node.send(msg);
            } catch (e) {
                if (e instanceof RangeError && e.code === 'ERR_BUFFER_OUT_OF_BOUNDS') {
                    // Output expected ERR_BUFFER_OUT_OF_BOUNDS RangeErrors.
                    this.status({ fill: "red", shape: "dot", text: "RangeError" });
                } else {
                    this.status({ fill: "red", shape: "dot", text: e.code });
                }
            }
        });
    }
    RED.nodes.registerType("red-advlib-ble", redAdvlibBle);
}