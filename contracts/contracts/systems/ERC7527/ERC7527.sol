// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import {ERC721Enumerable, ERC721, IERC721Enumerable} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Address} from "@openzeppelin/contracts/utils/Address.sol";
import {ClonesWithImmutableArgs} from "clones-with-immutable-args/ClonesWithImmutableArgs.sol";
import {IERC7527App} from "../../interface/IERC7527App.sol";
import {IERC7527Agency, Asset} from "../../interface/IERC7527Agency.sol";
import {IERC7527Factory, AgencySettings, AppSettings} from "../../interface/IERC7527Factory.sol";

contract ERC7527Agency is IERC7527Agency {
    using Address for address payable;

    modifier onlyApp() {
        uint256 offset = _getImmutableArgsOffset();
        address app;
        assembly {
            app := shr(0x60, calldataload(add(offset, 76)))
        }
        require(msg.sender == app, "ERC7527Agency: caller is not the app");
        _;
    }

    receive() external payable {}

    function unwrap(
        address to,
        uint256 tokenId,
        bytes calldata data
    ) external payable override {
        (address _app, Asset memory _asset, ) = getStrategy();
        require(
            _isApprovedOrOwner(_app, tx.origin, tokenId),
            "LnModule: not owner"
        );
        uint256 abration_ = abi.decode(data, (uint256));
        IERC7527App(_app).burn(tokenId, data);
        uint256 _sold = IERC721Enumerable(_app).totalSupply();
        (uint256 swap, uint256 burnFee) = getUnwrapOracle(abi.encode(_sold));

        IERC20(_asset.currency).transfer(
            to,
            (swap * abration_) / 100 - burnFee
        );
        emit Unwrap(to, tokenId, swap, burnFee);
    }

    function wrap(
        address to,
        bytes calldata data
    ) external payable override returns (uint256) {
        (address _app, Asset memory _asset, ) = getStrategy();
        uint256 _sold = IERC721Enumerable(_app).totalSupply();

        (uint256 swap, uint256 mintFee) = getWrapOracle(abi.encode(_sold));
        (uint256 tokenId_, uint8 grade_) = abi.decode(data, (uint256, uint8));
        IERC20(_asset.currency).transferFrom(
            to,
            address(this),
            (swap + mintFee) * grade_
        );

        uint256 id_ = IERC7527App(_app).mint(to, abi.encode(tokenId_));
        require(
            _sold + 1 == IERC721Enumerable(_app).totalSupply(),
            "ERC7527Agency: Reentrancy"
        );
        emit Wrap(to, id_, swap, mintFee);
        return id_;
    }

    function getStrategy()
        public
        pure
        override
        returns (address app, Asset memory asset, bytes memory attributeData)
    {
        uint256 offset = _getImmutableArgsOffset();
        address currency;
        uint256 premium;
        address payable awardFeeRecipient;
        uint16 mintFeePercent;
        uint16 burnFeePercent;
        assembly {
            app := shr(0x60, calldataload(add(offset, 0)))
            currency := shr(0x60, calldataload(add(offset, 20)))
            premium := calldataload(add(offset, 40))
            awardFeeRecipient := shr(0x60, calldataload(add(offset, 72)))
            mintFeePercent := shr(0xf0, calldataload(add(offset, 92)))
            burnFeePercent := shr(0xf0, calldataload(add(offset, 94)))
        }
        asset = Asset(
            currency,
            premium,
            awardFeeRecipient,
            mintFeePercent,
            burnFeePercent
        );
        attributeData = "";
    }

    function getUnwrapOracle(
        bytes memory data
    ) public pure override returns (uint256 swap, uint256 fee) {
        uint256 input = abi.decode(data, (uint256));
        (, Asset memory _asset, ) = getStrategy();
        swap = _asset.premium + (input * _asset.premium) / 100;
        fee = (swap * _asset.burnFeePercent) / 10000;
    }

    function getWrapOracle(
        bytes memory data
    ) public pure override returns (uint256 swap, uint256 fee) {
        uint256 input = abi.decode(data, (uint256));
        (, Asset memory _asset, ) = getStrategy();
        swap = _asset.premium + (input * _asset.premium) / 100;
        fee = (swap * _asset.mintFeePercent) / 10000;
    }

    function _transfer(
        address currency,
        address recipient,
        uint256 premium
    ) internal {
        if (currency == address(0)) {
            payable(recipient).sendValue(premium);
        } else {
            IERC20(currency).transfer(recipient, premium);
        }
    }

    function _isApprovedOrOwner(
        address app,
        address spender,
        uint256 tokenId
    ) internal view virtual returns (bool) {
        IERC721Enumerable _app = IERC721Enumerable(app);
        address _owner = _app.ownerOf(tokenId);
        return (spender == _owner ||
            _app.isApprovedForAll(_owner, spender) ||
            _app.getApproved(tokenId) == spender);
    }

    /// @return offset The offset of the packed immutable args in calldata

    function _getImmutableArgsOffset() internal pure returns (uint256 offset) {
        // solhint-disable-next-line no-inline-assembly
        assembly {
            offset := sub(
                calldatasize(),
                add(shr(240, calldataload(sub(calldatasize(), 2))), 2)
            )
        }
    }
}

contract ERC7527App is ERC721Enumerable, IERC7527App {
    address lotloot;

    constructor() ERC721("carComponent", "CCT") {}

    address payable private _oracle;

    modifier onlyAgency() {
        require(msg.sender == _getAgency(), "only agency");
        _;
    }

    function getName(uint256) external pure returns (string memory) {
        return "App";
    }

    function getMaxSupply() public pure override returns (uint256) {
        return 100;
    }

    function getAgency() external view override returns (address payable) {
        return _getAgency();
    }

    function setAgency(address payable oracle) external override {
        require(_getAgency() == address(0), "already set");
        _oracle = oracle;
    }

    function setLotLootAddress(address _lotloot) external {
        require(lotloot == address(0), "lotloot address has being setting");
        lotloot = _lotloot;
    }

    function mint(
        address to,
        bytes calldata data
    ) external override onlyAgency returns (uint256) {
        require(totalSupply() < getMaxSupply(), "max supply reached");

        uint256 tokenId = abi.decode(data, (uint256));
        _mint(to, tokenId);

        _approve(lotloot, tokenId);
        return tokenId;
    }

    function burn(
        uint256 tokenId,
        bytes calldata
    ) external override onlyAgency {
        _burn(tokenId);
    }

    function _getAgency() internal view returns (address payable) {
        return _oracle;
    }
}

contract ERC7527Factory is IERC7527Factory {
    using ClonesWithImmutableArgs for address;

    function deployWrap(
        AgencySettings calldata agencySettings,
        AppSettings calldata appSettings,
        bytes calldata
    ) external override returns (address, address) {
        address appInstance = appSettings.implementation.clone(
            appSettings.immutableData
        );
        address agencyInstance;
        {
            agencyInstance = address(agencySettings.implementation).clone(
                abi.encodePacked(
                    appInstance,
                    agencySettings.asset.currency,
                    agencySettings.asset.premium,
                    agencySettings.asset.feeRecipient,
                    agencySettings.asset.mintFeePercent,
                    agencySettings.asset.burnFeePercent,
                    agencySettings.immutableData
                )
            );
        }

        IERC7527App(appInstance).setAgency(payable(agencyInstance));
        if (agencySettings.initData.length != 0) {
            (bool success, bytes memory result) = agencyInstance.call(
                agencySettings.initData
            );

            if (!success) {
                assembly {
                    revert(add(result, 32), mload(result))
                }
            }
        }

        if (appSettings.initData.length != 0) {
            (bool success, bytes memory result) = appInstance.call(
                appSettings.initData
            );

            if (!success) {
                assembly {
                    revert(add(result, 32), mload(result))
                }
            }
        }
        return (appInstance, agencyInstance);
    }
}
