const { ethers } = require("hardhat")
const { expect, assert } = require("chai")

//describe("SimpleStorage", () => {}) 第二个这里是匿名函数 和下句基本一样
describe("SimpleStorage", function () {
    // decribe()://hardhat will recognize | two parameters

    let simpleStorageFactory, simpleStorage // 声明 让it()也能用
    beforeEach(async function () {
        //going to be some code that tells us what to do before each one of these its
        simpleStorageFactory = await ethers.getContractFactory("SimpleStorage")
        simpleStorage = await simpleStorageFactory.deploy()
    })

    it("Should start with a favorite number of 0", async function () {
        //are going to be where we actually write the code for running our tests

        const currentValue = await simpleStorage.retrieve()
        const expectedValue = "0"
        // assert
        // expect
        assert.equal(currentValue.toString(), expectedValue)
        // expect(currentValue.toString()).to.equal(expectedValue) 这句和上面含义一模一样
        //I'm asserting this retrieve to return zero which is going to be our expected value
    })
    it("Should update when we call store", async function () {
        const expectedValue = "7"
        const transactionResponse = await simpleStorage.store(expectedValue)
        await transactionResponse.wait(1)

        const currentValue = await simpleStorage.retrieve()
        assert.equal(currentValue.toString(), expectedValue)
    })
})
