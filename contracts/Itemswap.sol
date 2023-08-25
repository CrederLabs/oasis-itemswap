// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
import "hardhat/console.sol";

import "@openzeppelin/contracts/access/Ownable.sol";

contract Itemswap is Ownable {
    uint8 public cw = 10;

    // 0.03935: decimal 18
    uint256 public roseUSDPrice = 39350000000000000;
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

    function getItemUSDPrice() public view returns (uint256) {
        // cw, gpcBalance, itemBalance
        uint256 reserve = itemBalance / cw;
        uint256 itemGPCPrice = gpcBalance / reserve;
        // // 5000000000000000000
        // console.log("itemGPCPrice: ", itemGPCPrice);
        uint256 itemUSDPrice = itemGPCPrice * gpcUSDPrice / 1000000000000000000;
        return itemUSDPrice;
    }

    // function getItemROSEPrice() public view returns (uint256) {


    //     uint256 itemGPCPrice = gpcBalance / itemBalance / cw;
    //     uint256 itemUSDPrice = itemGPCPrice * gpcUSDPrice / 1000000;

    //     roseUSDPrice / itemUSDPrice;


    //     return itemUSDPrice;

    // }

    function buy(uint256 _amount) payable public nonReentrant {
        // 우선 1개씩만 테스트
        require(itemBalance >= _amount, "Insufficient item");

        // msg.value 확인

        // 아이템 개당 가격
        uint256 itemUSDPrice = getItemUSDPrice();

        require(itemUSDPrice * _amount == msg.value, "Invalid ROSE Amount");

        // TODO: msg.value -> GPC 로 바뀌고... 컨트랙트 gpcBalance 증가






        // TODO: amount 감소 -> 유저 item amount 증가
        
        
    }

    function sell() public nonReentrant {

    }



    // // 게임사 DB -> 컨트랙트로 아이템 이동
    // function transferInItem(string memory _itemName, uint256 _itemAmount) public nonReentrant returns (bool) {
    //     bool success = false;

    //     // 이미 존재하는 item 인가?
    //     if (indexOf(items, _itemName)) {
    //         // 이미 존재. 추가하기
    //         require(itemOwner[_itemName] == msg.sender, "Not authorized itemOwner");
    //         uint256 itemId = getIndex(items, _itemName);
    //         itemAmountData[itemId] += _itemAmount;
    //     } else {
    //         // 없던 item. 새로 세팅
    //         items.push(_itemName);
    //         itemOwner[_itemName] = msg.sender;
    //         uint256 itemId = items.length - 1;
    //         itemAmountData[itemId] = _itemAmount;
    //     }

    //     // TODO: emit Event

    //     success = true;
    //     return success;
    // }

    // // 컨트랙트 -> 게임사 DB로 아이템 이동
    // function transferOutItem(string memory _itemName, uint256 _itemAmount) public nonReentrant returns (bool) {
    //     bool success = false;

    //     require(indexOf(items, _itemName), "Not exists _itemName");
        
    //     uint256 itemId = getIndex(items, _itemName);
    //     require(itemAmountData[itemId] >= _itemAmount, "Insufficient item amount");
    //     itemAmountData[itemId] -= _itemAmount;

    //     // TODO: emit Event

    //     success = true;
    //     return success;
    // }

    // function indexOf(string[] memory _arr, string memory _searchFor) private pure returns (bool) {
    //     for (uint256 i = 0; i < _arr.length; i++) {
    //         if (keccak256(abi.encodePacked(_arr[i])) == keccak256(abi.encodePacked(_searchFor))) {
    //             return true;
    //         }
    //     }
    //     return false;
    // }

    // function getIndex(string[] memory _arr, string memory _searchFor) private pure returns (uint256) {
    //     for (uint256 i = 0; i < _arr.length; i++) {
    //         if (keccak256(abi.encodePacked(_arr[i])) == keccak256(abi.encodePacked(_searchFor))) {
    //             return i;
    //         }
    //     }
    //     revert("Not Found");
    // }

    // function createItemPool(uint8 _cw, uint256 _itemId, uint256 _itemAmount, uint256 _gpcAmount) public {
    //     // _itemId 가 유효한가?

    //     // 해당 item의 itemOwner 가 맞는가?

    //     // 
    // }

    // function estimateItemValueBeforePoolCreation(uint8 _cw, uint256 _itemId, uint256 _itemAmount, uint256 _gpcAmount) public {
        
    // }

    // // GPC deposit (미리 충분히 해둬야함)
    // function gpcDeposit() public {

    // }

    // // GPC <-> ROSE SWAP을 간소화시켜 사용하기 위한 용도
    // function roseDeposit() payable public {

    // }

    








    // uint public unlockTime;
    // address payable public owner;

    // event Withdrawal(uint amount, uint when);

    // constructor(uint _unlockTime) payable {
    //     require(
    //         block.timestamp < _unlockTime,
    //         "Unlock time should be in the future"
    //     );

    //     unlockTime = _unlockTime;
    //     owner = payable(msg.sender);
    // }

    // function withdraw() public {
    //     // Uncomment this line, and the import of "hardhat/console.sol", to print a log in your terminal
    //     // console.log("Unlock time is %o and block timestamp is %o", unlockTime, block.timestamp);

    //     require(block.timestamp >= unlockTime, "You can't withdraw yet");
    //     require(msg.sender == owner, "You aren't the owner");

    //     emit Withdrawal(address(this).balance, block.timestamp);

    //     owner.transfer(address(this).balance);
    // }
}
