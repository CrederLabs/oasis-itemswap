// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  const [owner, otherAccount] = await ethers.getSigners();
  console.log("owner: ", owner.address);

  const roseAmount = hre.ethers.parseEther("1");
  const itemswap = await hre.ethers.deployContract("Itemswap", {
    value: roseAmount,
  });
  await itemswap.waitForDeployment();
  console.log("deployed itemswap");

  let itemUSDPriceWei = await itemswap.getItemUSDPrice(0);
  console.log("itemUSDPriceWei: ", itemUSDPriceWei);
  // 3.1 USD
  let itemUSDPrice = hre.ethers.formatEther(itemUSDPriceWei);
  console.log("itemUSDPrice: ", itemUSDPrice);

  // item 당 ROSE 환산 가격
  let roseUSDPrice = await itemswap.roseUSDPrice();
  console.log("1 ROSE = ", roseUSDPrice);

  // let itemPriceBaseRose = parseFloat(itemUSDPrice) / parseFloat(roseUSDPrice);
  // console.log("1개 item의 ROSE 환산가: ", itemPriceBaseRose + " ROSE");

  let itemPriceBaseRose = await itemswap.getItemROSEPrice(0);
  console.log("itemPriceBaseRose: ", itemPriceBaseRose);

  // TVL 계산
  // item 전체 개수, GPC 보증금 합
  let itemBalance = await itemswap.itemBalance();
  console.log("itemBalance: ", itemBalance);

  // 78.780177890724269377
  let gpcBalanceWei = await itemswap.gpcBalance();
  console.log("gpcBalanceWei: ", gpcBalanceWei);
  let gpcBalance = hre.ethers.formatEther(gpcBalanceWei);
  console.log("gpcBalance: ", gpcBalance);

  let gpcUSDPriceWei = await itemswap.gpcUSDPrice();
  console.log("gpcUSDPriceWei: ", gpcUSDPriceWei);
  let gpcUSDPrice = hre.ethers.formatEther(gpcUSDPriceWei);
  console.log("gpcUSDPrice: ", gpcUSDPrice);

  let tvl = parseFloat(itemBalance) * parseFloat(itemUSDPrice) + parseFloat(gpcBalance) * parseFloat(gpcUSDPrice);
  console.log("tvl: ", tvl + " USD");

  // item 구매 전 유저의 item 개수
  let userItemAmount = await itemswap.userItemAmount(owner.address);
  console.log("userItemAmount: ", userItemAmount);

  // item 구매
  await itemswap.buy(1, {
    value: itemPriceBaseRose
  });

  // item 구매 후 유저의 item 개수
  let userItemAmount2 = await itemswap.userItemAmount(owner.address);
  console.log("userItemAmount2: ", userItemAmount2);

  // item 1개 구매 후 item 가격 계산
  let itemPriceBaseRose2 = await itemswap.getItemROSEPrice(0);
  console.log("itemPriceBaseRose2: ", itemPriceBaseRose2);


  // 판매를 위한 item ROSE 가격 계산
  let itemPriceBaseRose3 = await itemswap.getItemROSEPrice(1);
  console.log("itemPriceBaseRose3: ", itemPriceBaseRose3);

  console.log("-------------------- 판매 테스트 -------------------- ");

  // item 판매
  await itemswap.sell(1);

  // item 판매 후 유저의 item 개수
  let userItemAmount3 = await itemswap.userItemAmount(owner.address);
  console.log("userItemAmount3: ", userItemAmount3);

  // item 판매후 아이템 구매가
  let itemPriceBaseRose4 = await itemswap.getItemROSEPrice(0);
  console.log("item 판매후 아이템 구매가: ", itemPriceBaseRose4);

  // item 판매후 아이템 판매가
  let itemPriceBaseRose5 = await itemswap.getItemROSEPrice(1);
  console.log("item 판매후 아이템 판매가: ", itemPriceBaseRose5);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
