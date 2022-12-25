const { getNamedAccounts, ethers } = require("hardhat")

async function main() {
  const { deployer } = await getNamedAccounts()
  const BuyMeACoffee = await ethers.getContract("BuyMeACoffee", deployer)
  console.log("Funding contract...")
  const transactionResponse = await BuyMeACoffee.fund({
    value: ethers.utils.parseEther("0.1"),
  })
  await transactionResponse.wait(1)
  console.log("Bought coffe!")
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
