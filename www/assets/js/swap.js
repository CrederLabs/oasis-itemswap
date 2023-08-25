console.log("swap 페이지 실행...");



let userAccount;
let provider;
let signer;
let itemswap;

let userBalance = 0;
let userItemBalance = 0;

let itemPriceBaseRose = 0;

// Oasis Emerald Paratime Testnet: https://testnet.explorer.emerald.oasis.dev/address/0xAF5c20C66027B8A0Cc7539948bA4059eD8B747CB/transactions
const itemswapContractAddress = "0xAF5c20C66027B8A0Cc7539948bA4059eD8B747CB";
const itemswapABI = [{"inputs":[],"stateMutability":"payable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"buy","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"cw","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint8","name":"_sellFlag","type":"uint8"}],"name":"getItemROSEPrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint8","name":"_sellFlag","type":"uint8"}],"name":"getItemUSDPrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"gpcBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"gpcUSDPrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"itemBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"roseUSDPrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"sell","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"userItemAmount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}];

function shortenAddress(address) {
    let resultStr = address.slice(0, 6) + "....." + address.slice(38, 42);
    return resultStr;
}

async function connectOasisWallet() {
    console.log("start to connect");

    // kaikas 만 허용
    provider = new ethers.providers.Web3Provider(window.ethereum);
    signer = provider.getSigner();

    // const accounts = await provider.send("eth_requestAccounts");
    // console.log("accounts: ", accounts);


    // Oasis Emerald 네트워크가 아니면 네트워크 변경 요청
    const chainId = await provider.getNetwork()
    console.log("chainId: ", chainId.chainId);

    // Oasis Web3 Gateway: https://docs.oasis.io/dapp/emerald/
    let targetChainId = 42261;
    let targetChainIdHex = "0xa515";

    if (chainId.chainId == targetChainId) {
      console.log("ok");
    } else {
      // 네트워크 변경 요청
      try {
        await window.klaytn.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: targetChainIdHex }], // chainId must be in hexadecimal numbers
          });
      } catch (e) {
        if (e.code == 4902) {
          alert(e.message);
        }
      }
    }

    const accounts = await provider.send("eth_requestAccounts");
    
    userAccount = accounts[0];
    console.log("userAccount: ", userAccount);
    localStorage.setItem("account", accounts[0]);

    // KlayDelegate 컨트랙트
    itemswap = new ethers.Contract(itemswapContractAddress, itemswapABI, signer);



    // $("#userAccount").text(accounts[0]);
    $(".connect-btn").hide();
    $(".userAddress").show();
    $(".logout").show();

    $(".userAddress").html("<a href='" + "https://testnet.explorer.emerald.oasis.dev/address/" + accounts[0] + "/transactions" + "' target='_blank'>" + shortenAddress(accounts[0]) + "</a>");


    await refresh();
}

async function refresh() {
    if (userAccount == undefined) {
        console.log("userAccount is undefined");
        return;
    }

    console.log("refresh");

    // item input 에 강제 1 기입
    $(".itemInputTag").val(1);

    // 내 ROSE 잔액
    userBalance = await provider.getBalance(userAccount);
    console.log("userBalance: ", userBalance);
    let userBalanceStr = ethers.utils.formatEther(userBalance);
    $(".myRoseBalanceValue").text((userBalanceStr * 1).toFixed(6));

    // 내 item 잔액
    userItemBalance = parseFloat(await itemswap.userItemAmount(userAccount));
    $(".myItemBalanceValue").text(userItemBalance);

    // itemswap 내 전체 item 개수
    let totalItemBalance = parseFloat(await itemswap.itemBalance());

    // itemswap 내 전체 GPC 보증금 잔액
    let gpcBalanceWei = await itemswap.gpcBalance();
    console.log("gpcBalanceWei: ", gpcBalanceWei);
    let gpcBalance = ethers.utils.formatEther(gpcBalanceWei);
    console.log("gpcBalance: ", gpcBalance);

    // GPC 가격
    let gpcUSDPriceWei = await itemswap.gpcUSDPrice();
    console.log("gpcUSDPriceWei: ", gpcUSDPriceWei);
    let gpcUSDPrice = ethers.utils.formatEther(gpcUSDPriceWei);
    console.log("gpcUSDPrice: ", gpcUSDPrice);

    // ROSE 가격
    let roseUSDPriceWei = await itemswap.roseUSDPrice();
    // console.log("1 ROSE = ", roseUSDPriceWei);
    let roseUSDPrice = ethers.utils.formatEther(roseUSDPriceWei);
    console.log("1 ROSE = ", roseUSDPrice);

    // item 1개 구매 가격(ROSE)
    let itemPriceBaseRoseWei = await itemswap.getItemROSEPrice(0);
    let itemPriceBaseRose = ethers.utils.formatEther(itemPriceBaseRoseWei);
    $(".roseInputTagForBuy").val(itemPriceBaseRose);

    // item 1개 판매 가격(ROSE)
    // roseInputTagForSell
    let itemPriceBaseRoseWei2 = await itemswap.getItemROSEPrice(1);
    let itemPriceBaseRose2 = ethers.utils.formatEther(itemPriceBaseRoseWei2);
    $(".roseInputTagForSell").val(itemPriceBaseRose2);

    // item 1개 가격(USD)
    let itemUSDPriceWei = await itemswap.getItemUSDPrice(0);
    let itemUSDPrice = ethers.utils.formatEther(itemUSDPriceWei);

    // TVL 계산
    let tvl = totalItemBalance * itemUSDPrice + gpcBalance * gpcUSDPrice;
    console.log("tvl: ", tvl);
    $(".tvl").text((tvl * 1).toFixed(2));
}

setInterval(refresh, 5000);

async function buy() {
    console.log("buy");

    // itemInputTag 1이 아닌 경우 막기
    if ( $(".itemInputTag").val() * 1 != 1) {
        alert("In the test version, only one can be exchanged.");
        return;
    }

    const options = {value: ethers.utils.parseEther($(".roseInputTagForBuy").val())};
    let result = await itemswap.buy($(".itemInputTag").val() * 1, options);
    alert("Completed! Txhash: " + result.hash);


    await refresh();
}

async function sell() {
    console.log("sell");

    if ( $(".itemInputTag").val() * 1 != 1) {
        alert("In the test version, only one can be exchanged.");
        return;
    }

    // 내 item 수량이 1개 이상인가?
    if (userItemBalance < 1) {
        alert("Insufficient HP Potion");
        return;
    }

    let result = await itemswap.sell(1);
    alert("Completed! Txhash: " + result.hash);

    await refresh();
}
