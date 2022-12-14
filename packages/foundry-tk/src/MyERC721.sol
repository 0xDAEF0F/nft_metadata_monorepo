// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import { ERC721 } from 'solmate/tokens/ERC721.sol';
import { Owned } from 'solmate/auth/Owned.sol';
import { MerkleProofLib } from 'solmate/utils/MerkleProofLib.sol';

contract MyERC721 is ERC721, Owned {
    /*//////////////////////////////////////////////////////////////
                          STATE VARIABLES
    //////////////////////////////////////////////////////////////*/
    uint256 public constant MAX_SUPPLY = 10000;

    // Merkle root of the NFT allowlist
    bytes32 public immutable merkleRoot;

    // Counter for minted NFTs
    uint256 private _currentSupply = 0;

    /*//////////////////////////////////////////////////////////////
                                 ERRORS
    //////////////////////////////////////////////////////////////*/
    error InvalidProof();
    error MaxSupplyReached();

    constructor(bytes32 _merkleRoot) ERC721('MY NFT', 'NFT') Owned(msg.sender) {
        merkleRoot = _merkleRoot;
    }

    function tokenURI(uint256 id) public pure override returns (string memory) {
        return string(abi.encodePacked('https://mydomain.com/', id));
    }

    function mint(bytes32[] calldata proof) public {
        if (_currentSupply > MAX_SUPPLY) revert MaxSupplyReached();
        if (
            !MerkleProofLib.verify(
                proof,
                merkleRoot,
                keccak256(abi.encodePacked(msg.sender))
            )
        ) revert InvalidProof();
        _safeMint(msg.sender, _currentSupply++);
    }
}
