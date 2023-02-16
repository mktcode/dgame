// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract DGame is ERC721, ERC721URIStorage, ERC721Burnable, Ownable {
  using Counters for Counters.Counter;

  Counters.Counter private _tokenIdCounter;

  struct Coordinate {
    int256 x;
    int256 y;
    int256 z;
  }

  event TokenMinted(uint256 tokenId, address owner, int256 x, int256 y, int256 z);
  event LevelUp(uint256 tokenId, uint256 newLevel);

  mapping (int256 => mapping(int256 => mapping(int256 => uint256))) public tokenIdsByCoordinate;
  mapping (uint256 => Coordinate) public coordinatesByTokenId;
  mapping (uint256 => uint256) public tokenLevels;
  uint256 constant public COORD_BASE_PRICE = 0.0001 ether;
  uint256 constant public LEVEL_BASE_PRICE = 0.0001 ether;

  constructor() ERC721("DGame", "DGAME") {
    _tokenIdCounter.increment();
  }

  modifier onlyAvailableCoords(int256 x, int256 y, int256 z) {
    require(tokenIdsByCoordinate[x][y][z] == 0, "Coordinate already taken");
    _;
  }

  /** Required overrides */
  function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
    Coordinate memory coordinate = coordinatesByTokenId[tokenId];
    tokenIdsByCoordinate[coordinate.x][coordinate.y][coordinate.z] = 0;
    delete coordinatesByTokenId[tokenId];
    super._burn(tokenId);
  }

  function tokenURI(uint256 tokenId)
    public
    view
    override(ERC721, ERC721URIStorage)
    returns (string memory)
  {
    return super.tokenURI(tokenId);
  }
  /** End required overrides */

  function safeMint(int256 x, int256 y, int256 z) public payable onlyAvailableCoords(x, y, z) {
    uint256 price = getMintPrice(_msgSender());
    require(msg.value >= price, "Not enough ETH to mint");

    uint256 tokenId = _tokenIdCounter.current();
    _tokenIdCounter.increment();

    tokenIdsByCoordinate[x][y][z] = tokenId;
    coordinatesByTokenId[tokenId] = Coordinate(x, y, z);
    
    _safeMint(_msgSender(), tokenId);
    payable(owner()).transfer(msg.value);

    emit TokenMinted(tokenId, _msgSender(), x, y, z);
  }

  function updateUri(uint256 tokenId, string memory uri) public {
    require(_isApprovedOrOwner(_msgSender(), tokenId), "ERC721: caller is not owner nor approved");
    _setTokenURI(tokenId, uri);
  }

  function levelUp(uint256 tokenId) public payable {
    require(_isApprovedOrOwner(_msgSender(), tokenId), "ERC721: caller is not owner nor approved");

    uint256 price = getTokenLevelPrice(tokenId);
    require(msg.value >= price, "Not enough ETH to level up");
    tokenLevels[tokenId] += 1;
    payable(owner()).transfer(msg.value);

    emit LevelUp(tokenId, tokenLevels[tokenId]);
  }

  function getTokenLevelPrice(uint256 tokenId) public view returns (uint256) {
    return LEVEL_BASE_PRICE * 2 ** tokenLevels[tokenId];
  }

  function getMintPrice(address tokenOwner) public view returns (uint256) {
    uint256 ownedTokens = balanceOf(tokenOwner);
    return COORD_BASE_PRICE * 2 ** ownedTokens;    
  }
}
