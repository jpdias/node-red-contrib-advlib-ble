var helper = require("node-red-node-test-helper");
var redAdvlibBleNode = require("../redAdvlibBle.js");

describe('red-advlib-ble Node', function () {

    afterEach(function () {
        helper.unload();
    });

    it('should be loaded', function (done) {
        var flow = [{
            id: "n1",
            type: "red-advlib-ble",
            name: "test name"
        }];
        helper.load(redAdvlibBleNode, flow, function () {
            var n1 = helper.getNode("n1");
            n1.should.have.property('name', 'test name');
            done();
        });
    });

    it('should convert the ble payload to json', function (done) {
        var flow = [
            {
                id: "n1",
                type: "red-advlib-ble",
                name: "test name",
                wires: [["n2"]]
            },
            {
                id: "n2",
                type: "helper"
            }
        ];
        helper.load(redAdvlibBleNode, flow, function () {
            var n2 = helper.getNode("n2");
            var n1 = helper.getNode("n1");
            n2.on("input", function (msg) {
                let result = {
                    rxAdd: "random",
                    txAdd: "random",
                    type: "ADV_NONCONN_IND",
                    length: 29,
                    advA: "bada55beac04",
                    name: "advlib by reelyActive"
                }
                msg.should.have.property('payload', result);
                done();
            });
            n1.receive({ payload: "c21d04acbe55daba16096164766c6962206279207265656c79416374697665" });
        });
    });
});
