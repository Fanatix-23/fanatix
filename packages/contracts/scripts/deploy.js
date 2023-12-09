
const {ethers} = require("hardhat");
// contract address -  0x179381D8A575D50d9EE6f74CD3F486F7D6A0EFc0
async function main() {
  const nft = await ethers.getContractFactory("fanatix");
  const contract = await nft.deploy();
  console.log(await contract.getAddress());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
