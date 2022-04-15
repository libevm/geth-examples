const { ethers } = require("ethers");

const provider = new ethers.providers.JsonRpcProvider();

export const toRpcHexString = (bn) => {
    let val = bn.toHexString();
    val = "0x" + val.replace("0x", "").replace(/^0+/, "");

    if (val == "0x") {
        val = "0x0";
    }

    return val;
};

const main = async () => {
    const txResp = await provider.getTransactionReceipt('0x818b700de19d807ff9fa23c52fd6afd9dad7a419e0b9e6124edeecb4f53cbca8');

    await provider.send("debug_traceCall", [
        {
            from: txResp.from,
            to: txResp.to,
            value: toRpcHexString(txResp.value),
            gas: toRpcHexString(txResp.gasLimit),
            data: txResp.data,
        },
        "14586706",
        {
            tracer: `{
                data: [],
                fault: function(log) {},
                step: function(log) {
                    var s = log.op.toString();
                    if(s == "LOG0" || s == "LOG1" || s == "LOG2" || s == "LOG3" || s == "LOG4") {
                        var myStack = [];
                        var stackLength = log.stack.length();
                        for (var i = 0; i < stackLength; i++) {
                            myStack.unshift(log.stack.peek(i));
                        }
                        
                        var offset = parseInt(myStack[stackLength - 1]);
                        var length = parseInt(myStack[stackLength - 2]);
                        this.data.push({
                            op: s,
                            address: log.contract.getAddress(),
                            caller: log.contract.getCaller(),
                            stack: myStack,
                            memory: log.memory.slice(offset, offset + length),
                        }); 
                    }
                },
                result: function() { return this.data; }}
            `,
        },
    ]);
}