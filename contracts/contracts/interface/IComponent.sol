//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.9;
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/IERC721EnumerableUpgradeable.sol";

interface IComponent is IERC721EnumerableUpgradeable {
    function baseSpeed(uint256 tokenId) external view returns (uint256);

    function baseMaxTime(uint256 tokenId) external view returns (uint256);

    function getSpeedUp(uint256 tokenId) external view returns (uint256);

    function getMaxTimeUp(uint256 tokenId) external view returns (uint256);

    function tokenOfOwnerByIndex(
        address owner,
        uint256 index
    ) external view returns (uint256);

    function getComponentIdByTokenId(
        uint256 tokenId
    ) external view returns (uint8);

    function balanceOf(address owner) external view returns (uint256);

    function ownerOf(uint256 tokenId) external view returns (address);
}
