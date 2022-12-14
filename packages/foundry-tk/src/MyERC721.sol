// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import { ERC721 } from 'solmate/tokens/ERC721.sol';
import { Owned } from 'solmate/auth/Owned.sol';
import { MerkleProofLib } from 'solmate/utils/MerkleProofLib.sol';

contract MyERC721 is ERC721, Owned {
    /*//////////////////////////////////////////////////////////////
                          STATE VARIABLES
    //////////////////////////////////////////////////////////////*/

    // constants initialized in constructor
    bytes32 public immutable merkleRoot;
    uint256 public immutable maxSupply;
    uint256 public immutable deployedAt;
    bytes32 public immutable baseUrl;

    // Counter for minted NFTs
    uint256 private s_counter;

    /*//////////////////////////////////////////////////////////////
                                 ERRORS
    //////////////////////////////////////////////////////////////*/
    error InvalidProofOrNotTimeToMint();
    error MaxSupplyReached();

    constructor(
        bytes32 _merkleRoot,
        uint256 _supply,
        string memory name,
        string memory symbol,
        bytes32 _baseUrl
    ) ERC721(name, symbol) Owned(msg.sender) {
        merkleRoot = _merkleRoot;
        maxSupply = _supply;
        deployedAt = block.timestamp;
        baseUrl = _baseUrl;
    }

    function tokenURI(uint256 id) public pure override returns (string memory) {
        return string(abi.encodePacked('https://mydomain.com/', id));
    }

    function mint(bytes32[] calldata proof) public {
        if (s_counter >= maxSupply) revert MaxSupplyReached();
        if (
            (block.timestamp < deployedAt + 1 days) &&
            !MerkleProofLib.verify(
                proof,
                merkleRoot,
                keccak256(abi.encodePacked(msg.sender))
            )
        ) revert InvalidProofOrNotTimeToMint();
        _safeMint(msg.sender, s_counter++);
    }
}
