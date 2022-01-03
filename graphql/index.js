const { ethers } = require("ethers");
const { request } = require("graphql-request");

// Make sure you start geth with:
// geth --graphql --http --http.api web3,net,eth,debug --http.addr "0.0.0.0" --http.port 8545

// Pads bytes(0-32) to bytes 32
const padToBytes32 = (x) => {
  return ethers.utils.hexlify(
    ethers.utils.zeroPad("0x" + x.replace("0x", ""), 32)
  );
};

const decodeReserve = (rRaw) => {
  rRaw = rRaw.replace("0x", "");

  const decodeX = (x, t) => ethers.utils.defaultAbiCoder.decode([t], x)[0];

  const blockTimestampRaw = padToBytes32(rRaw.slice(0, 8));
  const reserve1Raw = padToBytes32(rRaw.slice(8, 36));
  const reserve0Raw = padToBytes32(rRaw.slice(36, 64));

  const blockTimestamp = decodeX(blockTimestampRaw, "uint32");
  const reserve1 = decodeX(reserve1Raw, "uint112");
  const reserve0 = decodeX(reserve0Raw, "uint112");

  return {
    blockTimestamp,
    reserve1,
    reserve0,
  };
};

const main = async () => {
  const resp = await request(
    "http://localhost:8545/graphql",
    `{ block() {
            sushi_weth_usdc: account(address: "0xB4e16d0168e52d35CaCD2c6185b44281Ec28C9Dc") {
                reserve: storage(slot: "0x0000000000000000000000000000000000000000000000000000000000000008")
            }
            uni_weth_usdc: account(address: "0x397FF1542f962076d0BFE58eA045FfA2d347ACa0") {
                reserve: storage(slot: "0x0000000000000000000000000000000000000000000000000000000000000008")
            }
        }

    }`
  );

  console.log(decodeReserve(resp.block.sushi_weth_usdc.reserve))
  console.log(decodeReserve(resp.block.uni_weth_usdc.reserve));
};

main();
