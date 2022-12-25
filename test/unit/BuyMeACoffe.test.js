const { deployments, ethers, getNamedAccounts } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")
const { assert, expect } = require("chai")

describe("BuyMeACoffe", async function () {
  let BuyMeACoffee
  let deployer
  let mockV3Aggregator
  const sendValue = ethers.utils.parseEther("1") // 1 ETH
  beforeEach(async function () {
    deployer = (await getNamedAccounts()).deployer
    await deployments.fixture(["all"])
    BuyMeACoffee = await ethers.getContract("BuyMeACoffee", deployer)
    mockV3Aggregator = await ethers.getContract("MockV3Aggregator", deployer)
  })
  describe("constructor", async function () {
    it("sets the aggregator addresses correctly", async function () {
      const response = await BuyMeACoffee.priceFeed()
      assert.equal(response, mockV3Aggregator.address)
    })
  })
  describe("fund", async function () {
    it("Fails if you don't send enough ETH", async function () {
      await expect(BuyMeACoffee.fund()).to.be.revertedWith(
        "You need to spend more ETH!"
      )
    })
    it("Update the amount funded data scructure", async function () {
      await BuyMeACoffee.fund({ value: sendValue }) //First time it funded
      const response = await BuyMeACoffee.getAddressToAmountFunded(deployer)
      assert.equal(response.toString(), sendValue.toString())
    })
    it("Adds funders to array of funders", async function () {
      await BuyMeACoffee.fund({ value: sendValue })
      const funder = await BuyMeACoffee.getFunder(0)
      assert.equal(funder, deployer)
    })
  })
})
