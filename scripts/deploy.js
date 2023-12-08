
const {ethers} = require("hardhat");

async function main() {
  const nft = await ethers.getContractFactory("abc");
  const contract = await nft.deploy();
  console.log(contract);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
