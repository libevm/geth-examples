const { ethers } = require('ethers')

// geth --dev
const provider = new ethers.providers.JsonRpcProvider()

// Raw bytecode and abi for 'contract'
const deployBytecode = `0x6080604052348015600f57600080fd5b50600a600081905550600a600181905550600a600281905550600a600381905550600a600481905550600a600581905550600a600681905550600a600781905550600a600881905550600a60098190555060a88061006e6000396000f3fe6080604052348015600f57600080fd5b506004361060285760003560e01c8063fde0e7a814602d575b600080fd5b60336035565b005b600080549050600154905060025490506003549050600454905060055490506006549050600754905060085490506009549050600a80819055505056fea264697066735822122053b7439483072e9672f620b53980874131f65127d2929bc25a0889c4dfcc302664736f6c634300080a0033`
const abi = `[{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"blob","outputs":[],"stateMutability":"nonpayable","type":"function"}]`

const main = async () => {
    // Lets go
    const signer = await provider.getSigner(0)
    const walletAddress = await signer.getAddress()

    // Address nonce
    const nonce = await signer.getTransactionCount()
    const contractAddress = ethers.utils.getContractAddress({
        from: walletAddress,
        nonce
    })

    // Deploy contract
    await signer.sendTransaction({
        data: deployBytecode
    })

    // Contract
    const contract = new ethers.Contract(contractAddress, abi, signer)

    // Default params
    const params = {
        from: walletAddress,
        to: contractAddress,
        data: contract.interface.encodeFunctionData('blob')
    }

    // Create transaction list
    const accessListDump = await provider.send('eth_createAccessList', [{ ...params, gas: '0x55730' }, "pending"])
    const overrides = {
        type: 2,
        accessList: accessListDump.accessList
    }

    const tx0 = await signer.sendTransaction(params)
    const tx0Recp = await tx0.wait()

    const tx1 = await signer.sendTransaction({ ...params, ...overrides })
    const tx1Recp = await tx1.wait()


    console.log('gasUsed (default)', tx0Recp.gasUsed.toString())
    console.log('========')
    console.log('accessList', JSON.stringify(overrides, null, 4))
    console.log('gasUsed (with access list)', tx1Recp.gasUsed.toString())
}

main()