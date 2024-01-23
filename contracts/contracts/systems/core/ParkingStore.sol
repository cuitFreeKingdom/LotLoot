//SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlEnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "../../interface/IERC721Ext.sol";
import "../../interface/IERC6551Account.sol";
import "../../interface/IERC6551Registry.sol";

contract ParkingStore is
    Initializable,
    PausableUpgradeable,
    AccessControlEnumerableUpgradeable,
    ReentrancyGuardUpgradeable,
    UUPSUpgradeable
{
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant GAME_ROLE = keccak256("GAME_ROLE");

    event ParkingMint(
        address indexed to,
        uint256 indexed tokenId,
        address account
    );
    event ParkingMintMax(address indexed to, uint256[] tokenIds);
    event ElectricChange(uint256 indexed tokenId, uint256 indexed electric);

    IERC721Ext _parkingERC721;
    IERC6551Account _erc6551Account;
    IERC6551Registry _erc6551Registry;

    using CountersUpgradeable for CountersUpgradeable.Counter;
    CountersUpgradeable.Counter private _tokenIdCounter;

    mapping(address => uint256) public parkingNFTCount;
    mapping(uint256 => uint256) public electric;

    //TODO initial token id
    uint256 public maxNFTPerAddress;
    uint256 internal _initialTokenId;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(
        address parkingERC721_,
        address erc6551Registry_,
        address payable erc6551Account_
    ) public initializer {
        _parkingERC721 = IERC721Ext(parkingERC721_);
        _erc6551Registry = IERC6551Registry(erc6551Registry_);
        _erc6551Account = IERC6551Account(erc6551Account_);
        _initialTokenId = 1000;
        maxNFTPerAddress = 5;

        __Pausable_init();
        __AccessControlEnumerable_init();
        __UUPSUpgradeable_init();

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(PAUSER_ROLE, msg.sender);
        _grantRole(UPGRADER_ROLE, msg.sender);
    }

    function _authorizeUpgrade(
        address newImplementation
    ) internal override onlyRole(UPGRADER_ROLE) {}

    function currentTokenId() public view returns (uint256) {
        return _tokenIdCounter.current() + _initialTokenId;
    }

    function _mintPark(address _address, uint256 _tokenId) internal {
        _parkingERC721.safeMint(_address, _tokenId);
    }

    function _mint(address _to) private returns (uint256) {
        uint256 _tokenId = currentTokenId();
        _tokenIdCounter.increment();

        _mintPark(_to, _tokenId);
        electric[_tokenId] = 100;

        parkingNFTCount[_to]++;

        address account = _erc6551Registry.createAccount(
            address(_erc6551Account),
            block.chainid,
            address(_parkingERC721),
            _tokenId,
            _tokenId,
            new bytes(0)
        );

        emit ParkingMint(_to, _tokenId, account);

        return _tokenId;
    }

    function mint() public whenNotPaused nonReentrant returns (uint256) {
        require(
            parkingNFTCount[msg.sender] <= maxNFTPerAddress,
            "Max NFT limit reached"
        );

        return _mint(msg.sender);
    }

    function charge(
        uint256 _tokenId,
        uint256 _electric
    ) public whenNotPaused onlyRole(GAME_ROLE) nonReentrant {
        if (electric[_tokenId] + _electric > 100) {
            electric[_tokenId] = 100;
        } else {
            electric[_tokenId] += _electric;
        }
        emit ElectricChange(_tokenId, electric[_tokenId]);
    }

    function consumption(
        uint256 _tokenId,
        uint256 _electric
    ) public whenNotPaused onlyRole(GAME_ROLE) {
        if (electric[_tokenId] > _electric) {
            electric[_tokenId] -= _electric;
        } else {
            electric[_tokenId] = 0;
        }
        emit ElectricChange(_tokenId, electric[_tokenId]);
    }

    function setElectric(
        uint256 _tokenId,
        uint256 _electric
    ) public whenNotPaused onlyRole(GAME_ROLE) {
        require(_electric >= 0 && _electric <= 100);
        electric[_tokenId] = _electric;
        emit ElectricChange(_tokenId, electric[_tokenId]);
    }

    function getElectric(uint256 _tokenId) external view returns (uint256) {
        return electric[_tokenId];
    }

    function mintMax()
        public
        whenNotPaused
        nonReentrant
        returns (uint256[] memory)
    {
        require(
            parkingNFTCount[msg.sender] <= maxNFTPerAddress,
            "Max NFT limit reached"
        );

        address _to = msg.sender;

        uint leftCount = maxNFTPerAddress - parkingNFTCount[_to];
        uint256[] memory tokenIds = new uint256[](leftCount);

        for (uint i = 0; i < leftCount; i++) {
            uint256 tokenId = _mint(_to);
            tokenIds[i] = tokenId;
        }

        emit ParkingMintMax(_to, tokenIds);

        return tokenIds;
    }
}
