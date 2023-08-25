// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
import "hardhat/console.sol";

import "@openzeppelin/contracts/access/Ownable.sol";

contract Itemswap is Ownable {
    uint8 public cw = 10;

    // 0.03935 -> 3.935 100배 높여서 계산: decimal 18
    // uint256 public roseUSDPrice = 39350000000000000;
    uint256 public roseUSDPrice = 3935000000000000000;
    // 0.62: decimal 18
    uint256 public gpcUSDPrice = 620000000000000000;

    uint256 public gpcBalance = 500 * 10**18;

    uint256 public itemBalance = 1000;

    mapping(address => uint256) public userItemAmount;

    mapping (address => bool) private _locks;

    modifier nonReentrant {
        require(_locks[msg.sender] != true, "ReentrancyGuard: reentrant call");

        _locks[msg.sender] = true;

        _;
    
        _locks[msg.sender] = false;
    }

    constructor() payable {}

    function getItemUSDPrice(uint8 _sellFlag) public view returns (uint256) {
        require(_sellFlag == 1 || _sellFlag == 0, "_sellFlag should be 0 or 1");

        // cw, gpcBalance, itemBalance
        uint256 reserve = 10**18 * itemBalance / cw;
        uint256 itemGPCPrice = 10**18 * gpcBalance / reserve;

        if (_sellFlag == 1) {
            uint256 estimatedItemBalance = itemBalance - 1;
            uint256 estimatedGPCBalance = gpcBalance - itemGPCPrice;

            reserve = 10**18 * estimatedItemBalance / cw;
            itemGPCPrice = 10**18 * estimatedGPCBalance / reserve;
        }

        // // 5000000000000000000
        // console.log("itemGPCPrice: ", itemGPCPrice);
        uint256 itemUSDPrice = itemGPCPrice * gpcUSDPrice / 1000000000000000000;
        return itemUSDPrice;
    }

    function getItemROSEPrice(uint8 _sellFlag) public view returns (uint256) {
        uint256 itemUSDPrice = getItemUSDPrice(_sellFlag);
        uint256 itemValueBaseRose = 10**18 * itemUSDPrice / roseUSDPrice;
        return itemValueBaseRose;
    }

    function buy(uint256 _amount) payable public nonReentrant {
        // 우선 1개씩만 테스트
        require(_amount == 1, "[TEST] _amount should be 1");

        require(itemBalance >= _amount, "Insufficient item");

        // msg.value 확인

        // 아이템 개당 가격
        uint256 itemROSEPrice = getItemROSEPrice(0);

        require(itemROSEPrice * _amount == msg.value, "Invalid ROSE Amount");

        // TODO: msg.value -> GPC 로 바뀌고... 컨트랙트 gpcBalance 증가
        
        // ROSE -> GPC
        uint256 itemUSDPrice = msg.value * roseUSDPrice / 10**18;
        console.log("[TEST] itemUSDPrice ", itemUSDPrice);

        uint256 itemGPCPrice = 10**18 * itemUSDPrice / gpcUSDPrice;
        console.log("[TEST] itemGPCPrice: ", itemGPCPrice);
        // 4999999999999999998

        // 컨트랙트 GPC 보증금 증가
        gpcBalance += itemGPCPrice;

        // TODO: 컨트랙트 amount 감소 -> 유저 item amount 증가
        itemBalance -= _amount;
        userItemAmount[msg.sender] += _amount;
    }

    function sell(uint256 _amount) public nonReentrant {
        // 우선 1개씩만 테스트
        require(_amount == 1, "[TEST] _amount should be 1");

        // 유저한테 _amount 가 있나?
        require(userItemAmount[msg.sender] >= _amount, "Insufficient users's _amount");

        // 팔 때는 (전체 아이템 개수 - 1)로 계산해서 팔아야함
        // 유저에게 지급할 ROSE: 아이템 개당 가격
        uint256 itemROSEValue = getItemROSEPrice(1);

        // TODO:
        // require(itemROSEPrice * _amount <= address(this)의 balance, "Invalid ROSE Amount");

        
        // ROSE -> GPC
        uint256 itemUSDPrice = itemROSEValue * roseUSDPrice / 10**18;
        console.log("[TEST] itemUSDPrice ", itemUSDPrice);

        uint256 itemGPCPrice = 10**18 * itemUSDPrice / gpcUSDPrice;
        console.log("[TEST] itemGPCPrice: ", itemGPCPrice);
        // 4999999999999999998

        // 컨트랙트의 GPC 보증금 감소
        gpcBalance -= itemGPCPrice;

        // TODO: 컨트랙트 amount 증가 -> 유저 item amount 감소
        itemBalance += _amount;
        userItemAmount[msg.sender] -= _amount;
    }
}
