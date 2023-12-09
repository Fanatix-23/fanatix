//SPDX-License-Identifier: MIT
pragma solidity 0.8.4;
import {abc} from "./ldas/abc.sol";

contract revenueSplit is abc {

  function depositRevenue() public payable{}
  function distributeRevenue() public payable {
    require(msg.sender == address(0),"the payer is not the owner");
    uint256 noOfAccounts = address(this).balance/(tierMaxSupply(1) + tierMaxSupply(2) + tierMaxSupply(3));
    for(uint i = 0; i < _OWNID_.length; i++) {
        address payable owner = _OWNID_[i];
        uint256 pay = noOfAccounts * _OWNED_[owner];
        owner.transfer(pay);
    }
  }
}