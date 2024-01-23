//SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "@openzeppelin/contracts-upgradeable/access/AccessControlEnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "../../interface/IERC721Ext.sol";
import "../../interface/IERC6551Account.sol";
import "../../interface/IERC6551Registry.sol";
import "../../tokens/LLTToken.sol";
import "../../interface/IComponent.sol";
import "./CompoentStore.sol";
import "./ParkingStore.sol";

contract LotLoot is
    Initializable,
    PausableUpgradeable,
    AccessControlEnumerableUpgradeable,
    UUPSUpgradeable
{
    event ParkCar(
        address indexed who,
        uint256 indexed carTokenId,
        uint256 indexed parkingTokenId
    );
    event UnParkCar(
        address indexed who,
        uint256 indexed carTokenId,
        uint256 indexed parkingTokenId
    );
    event FineCar(
        address indexed who,
        uint256 indexed carTokenId,
        uint256 indexed parkingTokenId
    );
    event Load(
        address indexed who,
        uint256 indexed carTokenId,
        uint256 indexed componentTokenId
    );
    event Unload(
        address indexed who,
        uint256 indexed carTokenId,
        uint256 indexed componentTokenId
    );

    LLTToken lltToken;
    IERC721Ext carNFT;
    IERC721Ext parkingNFT;
    IERC6551Registry registry;
    IERC6551Account account;
    IComponent component;
    ComponentStore componentStore;
    ParkingStore parkingStore;
    uint256 baseSpeed;
    uint256 baseMaxTime;

    struct carInfo {
        uint startTime;
        uint parkTokenId;
    }
    struct parkInfo {
        uint startTime;
        uint carTokenId;
    }
    mapping(uint => carInfo) private cars;
    mapping(uint => parkInfo) private parks;

    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(
        address _lltToken,
        address _carNFT,
        address _parkingNFT,
        address _registry,
        address payable _account,
        address _component,
        address _componentStore,
        address _parkingStore,
        uint256 _baseSpeed,
        uint256 _baseMaxTime
    ) public initializer {
        lltToken = LLTToken(_lltToken);
        carNFT = IERC721Ext(_carNFT);
        parkingNFT = IERC721Ext(_parkingNFT);
        registry = IERC6551Registry(_registry);
        account = IERC6551Account(_account);
        component = IComponent(_component);
        componentStore = ComponentStore(_componentStore);
        parkingStore = ParkingStore(_parkingStore);
        baseSpeed = _baseSpeed;
        baseMaxTime = _baseMaxTime;
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(UPGRADER_ROLE, msg.sender);
    }

    function getCurrentParkingElectric(
        uint256 _parkTokenId
    ) public view returns (uint256) {
        uint256 carTokenId_ = parks[_parkTokenId].carTokenId;
        if (carTokenId_ == 0) {
            return parkingStore.getElectric(_parkTokenId);
        } else {
            if (
                parkingNFT.ownerOf(_parkTokenId) ==
                parkingNFT.ownerOf(carTokenId_)
            ) {
                return
                    _min(
                        parkingStore.getElectric(_parkTokenId) -
                            (((block.timestamp -
                                parks[_parkTokenId].startTime) * 10) / 3600),
                        100
                    );
            } else {
                return
                    _min(
                        parkingStore.getElectric(_parkTokenId) +
                            (((block.timestamp +
                                parks[_parkTokenId].startTime) * 30) / 3600),
                        100
                    );
            }
        }
    }

    function _min(
        uint256 _num1,
        uint256 _num2
    ) internal pure returns (uint256) {
        if (_num1 < _num2) {
            return _num1;
        } else {
            return _num2;
        }
    }

    function load(uint256 _carTokenId, uint256 _componentTokenId) external {
        address carAddress = registry.account(
            address(account),
            block.chainid,
            address(carNFT),
            _carTokenId,
            _carTokenId
        );
        // get componentId
        uint8 componentId = componentStore.getComIdByTokenId(_componentTokenId);
        require(
            _loadPermit(_carTokenId, _componentTokenId, componentId),
            "you has load this type component"
        );
        component.transferFrom(msg.sender, carAddress, _componentTokenId);

        emit Load(msg.sender, _carTokenId, _componentTokenId);
    }

    function unload(uint256 _carTokenId, uint256 _componentTokenId) external {
        address carAddress = registry.account(
            address(account),
            block.chainid,
            address(carNFT),
            _carTokenId,
            _carTokenId
        );
        require(
            _unloadPermit(_carTokenId, _componentTokenId),
            "you cant unload this component"
        );
        // component.transferFrom(carAddress, msg.sender, _componentTokenId);
        bytes memory data = abi.encode(
            bytes4(keccak256("transfer(address,uint256)")),
            msg.sender,
            _componentTokenId
        );
        IERC6551Account(payable(carAddress)).executeCall(
            address(component),
            0,
            data
        );
        emit Unload(msg.sender, _carTokenId, _componentTokenId);
    }

    function _unloadPermit(
        uint256 _carTokenId,
        uint256 _componentTokenId
    ) internal view returns (bool) {
        address carAddress_ = registry.account(
            address(account),
            block.chainid,
            address(carNFT),
            _carTokenId,
            _carTokenId
        );
        require(
            cars[_carTokenId].parkTokenId == 0,
            "The car is now parked in the parking space"
        );
        // To do get permit
        require(component.ownerOf(_componentTokenId) == carAddress_);
        return true;
    }

    function _loadPermit(
        uint256 _carTokenId,
        uint256 _componentTokenId,
        uint8 _comId
    ) internal view returns (bool) {
        // To do get permit
        address carAddress_ = registry.account(
            address(account),
            block.chainid,
            address(carNFT),
            _carTokenId,
            _carTokenId
        );
        require(
            componentStore.getAbrasion(_componentTokenId) > 0,
            "You must repair this part first"
        );
        require(
            cars[_carTokenId].parkTokenId == 0,
            "The car is now parked in the parking space"
        );
        uint256 balance_ = component.balanceOf(carAddress_);
        for (uint256 i = 0; i < balance_; i++) {
            uint256 tokenId_ = component.tokenOfOwnerByIndex(carAddress_, i);
            uint256 comId = componentStore.getComIdByTokenId(tokenId_);
            require(_comId != comId, "you have load this type component");
        }
        return true;
    }

    function parkCar(uint _carTokenId, uint _parkTokenId) public {
        require(
            carNFT.ownerOf(_carTokenId) == msg.sender,
            "You are not the owner of the car"
        );
        require(cars[_carTokenId].parkTokenId == 0, "Car is already parked");
        require(parks[_parkTokenId].carTokenId == 0, "Park is already full");
        cars[_carTokenId] = carInfo(block.timestamp, _parkTokenId);
        parks[_parkTokenId] = parkInfo(block.timestamp, _carTokenId);

        emit ParkCar(msg.sender, _carTokenId, _parkTokenId);
    }

    function unParkCar(uint _carTokenId) public {
        require(carNFT.ownerOf(_carTokenId) == msg.sender, "Not owner of car");
        require(cars[_carTokenId].parkTokenId != 0, "Car is not parked");
        uint256 parkingTokenId_ = cars[_carTokenId].parkTokenId;
        if (
            parkingNFT.ownerOf(parkingTokenId_) == carNFT.ownerOf(_carTokenId)
        ) {
            parkingStore.setElectric(
                parkingTokenId_,
                getCurrentParkingElectric(parkingTokenId_)
            );
        } else {
            _handleUnparkCar(_carTokenId);
            // _handleCharge(cars[_carTokenId].parkTokenId);
        }
        _handleAbrasion(_carTokenId);

        parks[cars[_carTokenId].parkTokenId].carTokenId = 0;
        cars[_carTokenId].parkTokenId = 0;

        emit UnParkCar(msg.sender, _carTokenId, parkingTokenId_);
    }

    function _handleCharge(uint256 _parkTokenId) internal {
        uint256 electric_ = getCurrentParkingElectric(_parkTokenId);
        parkingStore.setElectric(_parkTokenId, electric_);
    }

    function _handleConsumption(uint256 _parkTokenId) internal {
        uint256 electric_ = getCurrentParkingElectric(_parkTokenId);
        parkingStore.consumption(_parkTokenId, electric_);
    }

    function getCurrentAbrasion(
        uint256 _carTokenId
    ) public view returns (uint256 abrasion) {
        // Todo getCurrntAbrusion
        if (
            carNFT.ownerOf(_carTokenId) ==
            parkingNFT.ownerOf(cars[_carTokenId].parkTokenId)
        ) {
            abrasion =
                ((block.timestamp - cars[_carTokenId].startTime) * 30) /
                1 hours;
        } else {
            abrasion =
                ((block.timestamp - cars[_carTokenId].startTime) * 10) /
                1 hours;
        }
    }

    function _handleAbrasion(uint256 _carTokenId) internal {
        // Todo handle abrusion
        address carAddress_ = registry.account(
            address(account),
            block.chainid,
            address(carNFT),
            _carTokenId,
            _carTokenId
        );
        uint256 abrasion_ = getCurrentAbrasion(_carTokenId);

        if (
            carNFT.ownerOf(_carTokenId) ==
            parkingNFT.ownerOf(cars[_carTokenId].parkTokenId)
        ) {
            componentStore.repair(carAddress_, abrasion_);
        } else {
            componentStore.wear(carAddress_, abrasion_);
        }
    }

    function getProperty(
        uint256 _carTokenId
    ) public view returns (uint256 speed, uint256 maxTime, uint256 punishRate) {
        // to do getSpeedUpTotal
        address carAddress_ = registry.account(
            address(account),
            block.chainid,
            address(carNFT),
            _carTokenId,
            _carTokenId
        );
        (speed, maxTime, punishRate) = componentStore.getProperty(carAddress_);
        speed += baseSpeed;
        maxTime += baseMaxTime;
    }

    function fineCar(uint _parkTokenId) public {
        require(
            parks[_parkTokenId].carTokenId != 0,
            "There are no cars in this space"
        );
        require(
            parkingNFT.ownerOf(_parkTokenId) == msg.sender,
            "Not owner of park"
        );
        require(
            carNFT.ownerOf(parks[_parkTokenId].carTokenId) != msg.sender,
            "You can not fine yourself"
        );
        _handleFineCar(_parkTokenId);
        _handleCharge(_parkTokenId);
        _handleAbrasion(parks[_parkTokenId].carTokenId);
        uint carTokenId = parks[_parkTokenId].carTokenId;
        address carOwner = carNFT.ownerOf(carTokenId);

        cars[parks[_parkTokenId].carTokenId].parkTokenId = 0;
        parks[_parkTokenId].carTokenId = 0;
        emit FineCar(carOwner, carTokenId, _parkTokenId);
    }

    function viewCarOnPark(uint _carTokenId) public view returns (uint) {
        return cars[_carTokenId].parkTokenId;
    }

    function viewParkOnCar(uint _parkTokenId) public view returns (uint) {
        return parks[_parkTokenId].carTokenId;
    }

    function _handleFineCar(uint _parkTokenId) internal {
        uint256 carTokenId_ = parks[_parkTokenId].carTokenId;

        require(
            carNFT.ownerOf(carTokenId_) != msg.sender,
            "You can not fine you owner car"
        );
        (uint256 speed, uint256 maxTime, uint256 punishRate) = getProperty(
            carTokenId_
        );
        uint256 fineAmount = block.timestamp - parks[_parkTokenId].startTime;
        if (fineAmount > maxTime) {
            fineAmount = maxTime;
        }
        lltToken.mint(
            parkingNFT.ownerOf(_parkTokenId),
            (fineAmount * speed * (100 - punishRate)) / 100
        );
        lltToken.mint(
            parkingNFT.ownerOf(carTokenId_),
            (fineAmount * punishRate) / 100
        );
    }

    function _handleUnparkCar(uint _carTokenId) internal {
        // get speed and maxTime
        (uint256 speed, uint256 maxTime, ) = getProperty(_carTokenId);
        uint256 mintAmount = block.timestamp - cars[_carTokenId].startTime;
        if (mintAmount > maxTime) {
            mintAmount = maxTime;
        }
        lltToken.mint(carNFT.ownerOf(_carTokenId), mintAmount * speed);
    }

    function _authorizeUpgrade(
        address newImplementation
    ) internal override onlyRole(UPGRADER_ROLE) {}
}
