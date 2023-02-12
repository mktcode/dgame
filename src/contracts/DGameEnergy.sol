// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "./DGame.sol";

contract DGameEnergy is ERC20, ERC20Burnable {
  DGame public dgame;

  mapping(uint256 => uint256) public timers;
  mapping(uint256 => uint256) public tokenLevels;

  constructor(address dgameAddress) ERC20("DGameEnergy", "DGE") {
    dgame = DGame(dgameAddress);
  }

  function mint(uint256 tokenId) public {
    require(timers[tokenId] > 0, "Token not activated");

    address tokenOwner = dgame.ownerOf(tokenId);

    require(tokenOwner != address(0), "Token not owned");

    uint256 amount = (block.timestamp - timers[tokenId]) * tokenLevels[tokenId];
    timers[tokenId] = block.timestamp;
    tokenLevels[tokenId] = dgame.tokenLevels(tokenId);

    _mint(tokenOwner, amount);
  }

  function activate(uint256 tokenId) public {
    require(timers[tokenId] == 0, "Token already activated");
    timers[tokenId] = block.timestamp;
    tokenLevels[tokenId] = dgame.tokenLevels(tokenId);
  }
}
