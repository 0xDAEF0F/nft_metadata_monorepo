// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import 'forge-std/Test.sol';
import { MyERC721 } from '../src/MyERC721.sol';

contract MyERC721Test is Test {
    MyERC721 public myERC721;
    bytes32 public merkleRoot;
    address public whitelistMinter = 0x61bA8997147106A2444d125AF7f201AC66676a10;

    event Transfer(
        address indexed from,
        address indexed to,
        uint256 indexed id
    );

    function setUp() public {
        vm.prank(address(0xB0B));
        merkleRoot = 0xd4d95031fa5d53177eb9ff9b1188a4b92160b497e5ff9bdcc04fbe40ebc1765a;
        myERC721 = new MyERC721(
            merkleRoot,
            1,
            'My NFT',
            'MYNFT',
            bytes32('www.baseUrl.com')
        );
    }

    function testBaseUri() public {
        bytes32 baseURI = myERC721.baseUrl();
        // need library for this
    }

    function testCannotMintMoreThanSupply() public {
        vm.startPrank(whitelistMinter);
        bytes32[] memory proof = new bytes32[](1);
        proof[
            0
        ] = 0x874419f5f43a1214f218e7b2508b8bed9a6e615ea3d443da3fb2d06de11dfc95;
        myERC721.mint(proof);
        vm.expectRevert();
        myERC721.mint(proof);
        vm.stopPrank();
    }

    function testCanFreelyMintAfterExpiration() public {
        bytes32[] memory proof = new bytes32[](1);
        proof[
            0
        ] = 0x874419f5f43a1214f218e7b2508b8bed9a6e615ea3d443da3fb2d06de11dfc95;
        vm.warp(1 days + 1 seconds);
        vm.prank(address(0xB0B));
        myERC721.mint(proof);
    }

    function testWhiteListMinterCanMint() public {
        vm.prank(whitelistMinter);
        bytes32[] memory proof = new bytes32[](1);
        proof[
            0
        ] = 0x874419f5f43a1214f218e7b2508b8bed9a6e615ea3d443da3fb2d06de11dfc95;
        vm.expectEmit(true, true, false, true);
        emit Transfer(address(0x0), whitelistMinter, 0);
        myERC721.mint(proof);
    }

    function testDifferentAddressCannotMint() public {
        vm.prank(address(0xA11CE));
        bytes32[] memory proof = new bytes32[](1);
        proof[
            0
        ] = 0x874419f5f43a1214f218e7b2508b8bed9a6e615ea3d443da3fb2d06de11dfc95;
        vm.expectRevert();
        myERC721.mint(proof);
    }
}
