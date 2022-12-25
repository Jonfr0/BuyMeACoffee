//hre => hardhat runtime environment
/*
// Method 1:
function deployFunc(hre) {
    hre.getNamAccounts()
    hre.deployments()
}

module.exports.default = deployFunc


//Method 2:
module.exports  = async (hre) => {
    const{ getNamAccounts, deployments } = hre
}

 */

const { network } = require("hardhat")
const { networkConfig, developmentChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

// Method 3:
module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()
  const chainId = network.config.chainId

  let ethUsdPriceFeedAddress
  if (developmentChains.includes(network.name)) {
    const ethUsdAggregator = await deployments.get("MockV3Aggregator")
    ethUsdPriceFeedAddress = ethUsdAggregator.address
  } else {
    ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
  }

  // How to change chains?
  // When going for a localhost or hardhat network we want to use a mock
  const args = [ethUsdPriceFeedAddress]
  const buyMeACoffee = await deploy("BuyMeACoffee", {
    contract: "BuyMeACoffee",
    from: deployer,
    args: args, //put price feed address
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  })
  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    await verify(buyMeACoffee.address, args)
  }
  log("================================================================")
}

module.exports.tags = ["all", "BuyMeACoffe"]
