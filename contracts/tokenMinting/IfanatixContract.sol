//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;


interface IfanatixContract {

    function tierBalanceOf(
        uint128 tierId,
        address owner
    )
        external
        view
        returns (uint256);

    function getOwnedTokens(
        uint128 tierId,
        address owner
    )
        external
        view
        returns (uint256[] memory);

    function mintable(
        uint128 tierId
    )
        external
        view
        returns (bool);
}
