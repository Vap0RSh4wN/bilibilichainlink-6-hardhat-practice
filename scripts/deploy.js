//imports
const { ethers, run, network } = require("hardhat") //虽然可以从ethers里导入，但hardhat里面也有
//run allows us to run hardhat tasks

//async main
async function main() {
    const SimpleStorageFactory = await ethers.getContractFactory(
        "SimpleStorage"
    )
    console.log("Deploying  contract...")
    const simpleStorage = await SimpleStorageFactory.deploy()
    await simpleStorage.deployed()
    // what's the private key?
    // what's the rpc url?
    console.log(`Deployed contract to: ${simpleStorage.address}`)

    //想实现 在local不自动verify,test network就自动verify
    console.log(network.config)

    if ((network.config.chainId === 4) & process.env.ETHERSCAN_API_KEY) {
        console.log("Waiting for block txes..")
        await simpleStorage.deployTransaction.wait(6)
        await verify(simpleStorage.address, [])
    }

    const currentValue = await simpleStorage.retrieve()
    console.log(`Current Value is: ${currentValue}`)

    // Update the current value
    const transactionResponse = await simpleStorage.store(7)
    await transactionResponse.wait(1)
    const updatedValue = await simpleStorage.retrieve()
    console.log(`Updated Value is: ${updatedValue}`)
}

async function verify(contractAddress, args) {
    console.log("Verifying contract...")
    //现实中很容易有错误弹出。比如这个contract已经被verified了
    try {
        await run("verify:verify", {
            address: contractAddress,
            contructorArguments: args,
        }) // 第一个verify是声明要做verification task，第二个verify是subtask
        //第二个参数是a object that contains the actual parameters
    } catch (e) {
        // e: any error
        if (e.message.toLowerCase().includes("already verified")) {
            console.log("Already Verified!")
        } else {
            console.log(e)
        }
    }
}

//main
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
