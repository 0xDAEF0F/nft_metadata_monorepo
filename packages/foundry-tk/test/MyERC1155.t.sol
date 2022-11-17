// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import 'forge-std/Test.sol';
import '../src/MyERC1155.sol';

contract MyERC1155Test is Test {
    MyERC1155 public myERC1155;

    function setUp() public {
        vm.prank(address(0xB0B));
        myERC1155 = new MyERC1155();
    }

    function testToken() public {
        assertEq(myERC1155.balanceOf(address(0xB0B), 1), 1);
    }
}
