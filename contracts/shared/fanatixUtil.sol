//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
library fanatixUtil {

    uint256 constant UPPER_ISSUANCE_ID_MASK = uint256(type(uint128).max) << 128;
    uint256 constant LOWER_TOKEN_ID_MASK = type(uint112).max;
    uint256 constant TOKEN_VERSION_MASK =
        uint256(type(uint128).max) ^ LOWER_TOKEN_ID_MASK;

    // Compose an LDA ID from its composite parts.
    function composeLDA_ID(
        uint128 tierID,
        uint128 tokenID
    )
        internal
        pure
        returns (uint256 fantix)
    {
        require(
            tierID != 0 && tokenID != 0,
            "Invalid fantix"
        ); 

        return (uint256(tierID) << 128) + uint256(tokenID);
    }

    // Decompose a raw LDA ID into its composite parts.
    function decomposeLDA_ID(
        uint256 fantix
    )
        internal
        pure
        returns (
            uint128 tierID,
            uint128 tokenID
        )
    {
        tierID = uint128(fantix >> 128);
        tokenID = uint128(fantix & LOWER_TOKEN_ID_MASK);
        require(
            tierID != 0 && tokenID != 0,
            "Invalid fantix"
        ); 
    }
}
