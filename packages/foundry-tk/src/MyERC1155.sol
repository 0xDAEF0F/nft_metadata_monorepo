// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import 'solmate/tokens/ERC1155.sol';
import 'solmate/auth/Owned.sol';

contract MyERC1155 is ERC1155, Owned {
    constructor() Owned(msg.sender) {
        _mint(msg.sender, 1, 1, '');
    }

    function uri(uint256 id) public pure override returns (string memory) {
        return string(abi.encodePacked('https://example.com/', id));
    }
}
