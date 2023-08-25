// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  // let tGPC = await hre.ethers.deployContract("DevERC20", ["Test Gold Pegged Coin", "tGPC"]);
  // await tGPC.waitForDeployment();
  // console.log("deployed GPC");

  const roseAmount = hre.ethers.parseEther("2.5");
  const itemswap = await hre.ethers.deployContract("Itemswap", {
    value: roseAmount,
  });
  await itemswap.waitForDeployment();
  console.log("deployed itemswap");
  
  let itemUSDPrice = await itemswap.getItemUSDPrice();
  console.log("itemUSDPrice: ", itemUSDPrice);
  // 3.1 USD

  // item 당 ROSE 환산 가격
  let roseUSDPrice = await itemswap.roseUSDPrice();
  console.log("1 ROSE = ", roseUSDPrice);

  let itemPriceBaseRose = parseFloat(itemUSDPrice) / parseFloat(roseUSDPrice);
  console.log("1개 item의 ROSE 환산가: ", itemPriceBaseRose + " ROSE");
  
  



  
  // const currentTimestampInSeconds = Math.round(Date.now() / 1000);
  // const unlockTime = currentTimestampInSeconds + 60;

  // const lockedAmount = hre.ethers.parseEther("0.001");

  // const lock = await hre.ethers.deployContract("Lock", [unlockTime], {
  //   value: lockedAmount,
  // });

  // await lock.waitForDeployment();

  // console.log(
  //   `Lock with ${ethers.formatEther(
  //     lockedAmount
  //   )}ETH and unlock timestamp ${unlockTime} deployed to ${lock.target}`
  // );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
