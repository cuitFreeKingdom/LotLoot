//SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "../../interface/IERC721Ext.sol";
import "../ERC7527/ERC7527.sol";

contract ComponentStore is ERC7527Factory, Initializable {
    struct property {
        uint8 comId;
        uint8 grade;
        uint256 speedUp;
        uint256 maxTimeUp;
        uint256 nonPunishRate;
    }
    mapping(uint256 => property) tokenToProperty;
    mapping(uint256 => uint256) abrasion;
    // as a init property
    uint256[][] properties;
    address public appDeployAddress;
    address public agencyDeployAddress;
    ERC7527Agency public agency;
    ERC7527App public app;
    ERC7527Factory public factory;

    //TODO initial token id
    uint256 internal _initialTokenId;

    event Buy(
        address indexed to,
        uint8 id,
        uint8 grade,
        uint256 indexed tokenId
    );
    event Sell(address indexed to, uint256 indexed tokenId);
    event Repaire(uint256 indexed tokenId, uint256 indexed abrasion);
    event Wear(uint256 indexed tokenId, uint256 indexed abrasion);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(
        address _tokenAddress,
        uint256[][] memory _properties
    ) public initializer {
        agency = new ERC7527Agency();
        app = new ERC7527App();
        factory = new ERC7527Factory();

        Asset memory asset = Asset({
            currency: _tokenAddress,
            premium: 0.1 ether,
            feeRecipient: msg.sender,
            mintFeePercent: uint16(10),
            burnFeePercent: uint16(10)
        });

        AgencySettings memory agencySettings = AgencySettings({
            implementation: payable(address(agency)),
            asset: asset,
            immutableData: bytes(""),
            initData: bytes("")
        });

        AppSettings memory appSettings = AppSettings({
            implementation: address(app),
            immutableData: bytes(""),
            initData: bytes("")
        });

        (appDeployAddress, agencyDeployAddress) = factory.deployWrap(
            agencySettings,
            appSettings,
            bytes("")
        );

        properties = _properties;
        _initialTokenId = 1000;
    }

    function getAbrasion(uint256 _tokenId) external view returns (uint256) {
        return abrasion[_tokenId];
    }

    function _repair(uint256 _tokenId, uint256 _abrasion) internal {
        if (abrasion[_tokenId] + _abrasion > 100) {
            abrasion[_tokenId] == 100;
        } else {
            abrasion[_tokenId] += 100;
        }
    }

    function _wear(uint256 _tokenId, uint256 _abrasion) internal {
        if (abrasion[_tokenId] > _abrasion) {
            abrasion[_tokenId] -= _abrasion;
        } else {
            abrasion[_tokenId] = 0;
        }
    }

    function repair(address _carAddress, uint256 _abrasion) external {
        uint256 balance_ = IERC721Ext(appDeployAddress).balanceOf(_carAddress);
        for (uint256 i = 0; i < balance_; i++) {
            uint256 tokenId_ = IERC721Ext(appDeployAddress).tokenOfOwnerByIndex(
                _carAddress,
                i
            );
            _repair(tokenId_, _abrasion);
            emit Repaire(tokenId_, _abrasion);
        }
    }

    function wear(address _carAddress, uint256 _abrasion) external {
        uint256 balance_ = IERC721Ext(appDeployAddress).balanceOf(_carAddress);
        for (uint256 i = 0; i < balance_; i++) {
            uint256 tokenId_ = IERC721Ext(appDeployAddress).tokenOfOwnerByIndex(
                _carAddress,
                i
            );
            _wear(tokenId_, _abrasion);
            emit Wear(tokenId_, _abrasion);
        }
    }

    function getProperty(
        address _address
    )
        public
        view
        returns (uint256 speedUp, uint256 maxTimeUp, uint256 punishRate)
    {
        uint256 balance_ = IERC721Ext(appDeployAddress).balanceOf(_address);
        for (uint256 i = 0; i < balance_; i++) {
            uint256 tokenId_ = IERC721Ext(appDeployAddress).tokenOfOwnerByIndex(
                _address,
                i
            );
            speedUp += tokenToProperty[tokenId_].speedUp;
            maxTimeUp += tokenToProperty[tokenId_].maxTimeUp;
            punishRate += tokenToProperty[tokenId_].nonPunishRate;
        }
    }

    function getComId(uint256 _tokenId) external view returns (uint256) {
        return tokenToProperty[_tokenId].comId;
    }

    function getSpeedUp(uint256 _tokenId) external view returns (uint256) {
        return tokenToProperty[_tokenId].speedUp;
    }

    function getMaxTimeUp(uint256 _tokenId) external view returns (uint256) {
        return tokenToProperty[_tokenId].maxTimeUp;
    }

    function getPunishRate(uint256 _tokenId) external view returns (uint256) {
        return tokenToProperty[_tokenId].nonPunishRate;
    }

    function getComIdByTokenId(uint256 _tokenId) external view returns (uint8) {
        return tokenToProperty[_tokenId].comId;
    }

    function buy(uint8 _id, uint8 _grade) public payable {
        uint256 _tokenId = _initialTokenId;
        _initialTokenId++;
        require(_id <= properties.length && _id > 0, "have not this component");
        require(
            _grade <= properties[0].length && _grade > 0,
            "have not this grade"
        );
        uint256 speedUp_ = 0;
        uint256 maxTimeUp_ = 0;
        uint256 punishRate_ = 0;
        if (_id == 1) {
            speedUp_ = properties[_id - 1][_grade - 1];
        } else if (_id == 2) {
            maxTimeUp_ = properties[_id - 1][_grade - 1];
        } else if (_id == 3) {
            punishRate_ = properties[_id - 1][_grade - 1];
        }

        uint256 tokenId_ = IERC7527Agency(payable(agencyDeployAddress)).wrap(
            msg.sender,
            abi.encode(_tokenId, _grade)
        );
        tokenToProperty[_tokenId] = property(
            _id,
            _grade,
            speedUp_,
            maxTimeUp_,
            punishRate_
        );
        abrasion[_tokenId] = 100;
        require(tokenId_ == _tokenId, "wrong token Id");
        emit Buy(msg.sender, _id, _grade, _tokenId);
    }

    function sell(uint256 _tokenId) public {
        require(
            IERC721Ext(appDeployAddress).ownerOf(_tokenId) == msg.sender,
            "It is not your component or you hava to unload it"
        );
        bytes memory call_ = abi.encode(abrasion[_tokenId]);
        IERC7527Agency(payable(agencyDeployAddress)).unwrap(
            payable(msg.sender),
            _tokenId,
            call_
        );
        tokenToProperty[_tokenId] = property(0, 0, 0, 0, 0);
        abrasion[_tokenId] = 0;
        emit Sell(msg.sender, _tokenId);
    }

    // receive() external payable {}
}
