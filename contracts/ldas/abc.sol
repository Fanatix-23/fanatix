//SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import { AccessControlUpgradeableGapless } from "../dependencies/openzeppelin/v4_7_0/AccessControlUpgradeableGapless.sol";
import { ERC1155UpgradeableGapless } from "../dependencies/openzeppelin/v4_7_0/ERC1155UpgradeableGapless.sol";
import { OwnableUpgradeableGapless } from "../dependencies/openzeppelin/v4_7_0/OwnableUpgradeableGapless.sol";

import { IfanatixContract } from "./IfanatixContract.sol";
import { fanatixUtil } from "../shared/fanatixUtil.sol";


contract abc is
    ERC1155UpgradeableGapless,
    OwnableUpgradeableGapless,
    IfanatixContract
{
    // -------------------- Storage -------------------- //

    /// @dev Mapping (tierId) => max supply for this tier
    mapping(uint128 => uint256) internal _MAX_SUPPLY_;

    /// @dev Mapping (tierId) => current supply for this tier.
    mapping(uint128 => uint256) internal _CURRENT_SUPPLY_;

    /// @dev Mapping (fantix) => owner address
    mapping(uint256 => address) internal _OWNERS_;

    /// @dev Mapping (tierId) => (owner address) => (owned count)
    mapping(uint256 => mapping(address => uint256)) internal _BALANCES_;

    /// @dev Mapping (tierId) => (owner address) => (owned index) => (fantix)
    mapping(uint256 => mapping(address => mapping(uint256 => uint256))) internal _OWNED_TOKENS_;

    /// @dev Mapping (fantix) => (owned index)
    mapping(uint256 => uint256) internal _OWNED_TOKENS_INDEX_;

    /// @dev Maping (ID) => (owner address)
    mapping(uint256 => address) public _OWNID_;

    /// @dev Mapping (owner address) => (owned count)
    mapping(address  => uint256) public  _OWNED_;

    ///@dev no of owners
    uint256 public noOfOwners;

    event initialized(string tokenid);

    event tierCreator(uint128 tierId, uint256 maxSupply);
    
    event tierUpdated(string  updatedTier, uint128 tierId, uint256 maxSupply);

    event mintToOwner(string  mintedOwner, address receipient, uint128 noOfNFT);

    modifier exists(uint128 fantix)  {
        require(_OWNERS_[fantix] != address(0),"lda doesn't exist");
        _;
    }

    modifier tierExists(uint128 tierId) {
        require(_MAX_SUPPLY_[tierId] != 0, "The tierId doesn't exist");
        _;
    }
    // ------------------ Constructor ------------------ //
    constructor() {
        _disableInitializers();
    }

    // -------------------- Initializers -------------------- //

    function initialize(
        string memory tokenMetadataUri
    )
        external
        initializer
    {
        __Context_init_unchained();
        __Ownable_init_unchained();
        __ERC1155_init_unchained(tokenMetadataUri);

        emit initialized(tokenMetadataUri);
    }

    // -------------------- Owner-Only Functions -------------------- //

    function updateTokenURI(
        string calldata tokenUri
    )
        external
        onlyOwner
    {
        _setURI(tokenUri);
    }

    // Create a tier of an LDA. In order for an LDA to be minted, it must belong to a valid tier that has not yet reached its max supply.
    function createTier(
        uint128 tierId,
        uint256 maxSupply
    )
        external
        onlyOwner
    {
        require(
            tierId != 0 && maxSupply != 0,
            "Invalid tier definition"
        );

        _MAX_SUPPLY_[tierId] = maxSupply;

        emit tierCreator(tierId, maxSupply);
    }

     // Update the max supply of a tier.
    function updateTier(
        uint128 tierId,
        uint256 maxSupply
    )
        external
        onlyOwner
        tierExists(tierId)
    {
        require(
            maxSupply != 0 && maxSupply >= _CURRENT_SUPPLY_[tierId],
            "Invalid max supply"
        );
        _MAX_SUPPLY_[tierId] = maxSupply;

        emit tierUpdated("Tier updated", tierId, maxSupply);
    }

    function mintfantixToOwner(
        address recipient,
        uint256 fantix,
        string  memory data,
        uint128 noOfNFT
    )
        external
    {
        require(
            _OWNERS_[fantix] == address(0),
            "LDA already minted"
        );
        (uint128 tierId,) = fanatixUtil.decomposeLDA_ID(fantix);

        require(
            this.mintable(tierId),
            "The token can't be minted"
        );
        // Update current supply before minting to prevent reentrancy attacks
        _CURRENT_SUPPLY_[tierId] += noOfNFT;
        bytes memory _data= bytes(abi.encodePacked(data));
        _mint(recipient, fantix, 1,_data);
        _OWNERS_[fantix] = recipient;
        if(_OWNED_[recipient] == 0) noOfOwners++;
        _OWNED_[recipient] += noOfNFT;
        emit mintToOwner("minted token", recipient, noOfNFT);
    }

    // Maximum supply of each tier
    function tierMaxSupply(
        uint128 tierId
    )
        public
        view
        returns (uint256)
    {
        return _MAX_SUPPLY_[tierId];
    }

     //What address owns the given fantix?
    function ownerOf(
        uint256 fantix
    )
        external
        view
        returns (address)
    {
        require(
            _OWNERS_[fantix] != address(0),
            "LDA DNE"
        );
        return _OWNERS_[fantix];
    }

    //Get the number of LDAs owned by a user within a particular tier.
    function tierBalanceOf(
        uint128 tierId,
        address owner
    )
        external
        view
        override
        returns (uint256)
    {
        return _BALANCES_[tierId][owner];
    }

    function tokenOfOwnerByIndex(
        uint128 tierId,
        address owner,
        uint256 index
    )
        external
        view
        returns (uint256)
    {
        require(
            index < _BALANCES_[tierId][owner],
            "Owner index out of bounds"
        );
        return _OWNED_TOKENS_[tierId][owner][index];
    }

    function getOwnedTokens(
        uint128 tierId,
        address owner
    )
        external
        view
        override
        returns (uint256[] memory)
    {
        uint256 balance = _BALANCES_[tierId][owner];
        uint256[] memory ownedTokens = new uint256[](balance);
        for (uint256 i = 0; i < balance; i++) {
            ownedTokens[i] = _OWNED_TOKENS_[tierId][owner][i];
        }
        return ownedTokens;
    }
    function composeLDA_ID(
        uint128 tierId,
        uint128 tokenId
    )
        external
        pure
        returns (
            uint256 fantix
        )
    {
        return fanatixUtil.composeLDA_ID(tierId,tokenId);
    }
    function decomposeLDA_ID(
        uint256 fantix
    )
        external
        pure
        returns (
            uint128 tierID,
            uint128 tokenID
        )
    {
        return fanatixUtil.decomposeLDA_ID(fantix);
    }

   function mintable(
        uint128 tierId
    )
        external
        view
        override
        returns (bool)
    {
        return _CURRENT_SUPPLY_[tierId] < _MAX_SUPPLY_[tierId];
    }
}
