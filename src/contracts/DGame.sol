// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract DGame is ERC721, ERC721URIStorage, ERC721Burnable {
  using Counters for Counters.Counter;

  Counters.Counter private _tokenIdCounter;

  struct Coordinate {
    int256 x;
    int256 y;
    int256 z;
  }

  mapping (int256 => mapping(int256 => mapping(int256 => uint256))) public tokenIdsByCoordinate;
  mapping (uint256 => Coordinate) public coordinatesByTokenId;

  constructor() ERC721("DGame", "DGAME") {}

  modifier onlyAvailableCoords(int256 x, int256 y, int256 z) {
    require(tokenIdsByCoordinate[x][y][z] == 0, "Coordinate already taken");
    _;
  }

  /** Required overrides */
  function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
    Coordinate memory coordinate = coordinatesByTokenId[tokenId];
    tokenIdsByCoordinate[coordinate.x][coordinate.y][coordinate.z] = 0;
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

  function safeMint(address to, int256 x, int256 y, int256 z) public onlyAvailableCoords(x, y, z) {
    uint256 tokenId = _tokenIdCounter.current();
    _tokenIdCounter.increment();
    _safeMint(to, tokenId);
  }

  function updateUri(uint256 tokenId, string memory uri) public {
    require(_isApprovedOrOwner(_msgSender(), tokenId), "ERC721: caller is not owner nor approved");
    _setTokenURI(tokenId, uri);
  }
}
