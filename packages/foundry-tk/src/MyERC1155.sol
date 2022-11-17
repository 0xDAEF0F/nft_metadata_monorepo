// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import 'solmate/tokens/ERC1155.sol';
import 'solmate/auth/Owned.sol';

contract MyERC1155 is ERC1155, Owned {
    uint256 public constant GOLD = 0;
    uint256 public constant SILVER = 1;
    uint256 public constant THORS_HAMMER = 2;

    constructor() Owned(msg.sender) {
        _mint(msg.sender, GOLD, 10**18, '');
        _mint(msg.sender, SILVER, 10**27, '');
        _mint(msg.sender, THORS_HAMMER, 1, '');
    }

    function uri(uint256 id) public pure override returns (string memory) {
        return string(abi.encodePacked('https://example.com/', id, '.json'));
    }
}
