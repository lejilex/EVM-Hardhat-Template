// SPDX-License-Identifier: MIT
// author: @stevieraykatz
pragma solidity ^0.8.19;

import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import {PausableUpgradeable} from "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {Path} from "./lib/Path.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {ILegit} from "./ILegit.sol";
import {ISwapRouter} from "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";

contract Legit is
    OwnableUpgradeable,
    PausableUpgradeable,
    ReentrancyGuard,
    ILegit
{
    using SafeERC20 for IERC20;
    using Path for bytes;

    /*///////////////////////////////////////////////
                    STORAGE
*/ //////////////////////////////////////////////

    mapping(address => bool) public acceptedTokens; // slot ...offset + 0
    ISwapRouter private router;

    // add storage here

    /*///////////////////////////////////////////////
                    PROXY INIT
*/ //////////////////////////////////////////////

    function initialize(
        address _owner,
        address _router,
        address[] calldata _acceptedTokens
    ) public initializer {
        __Ownable_init();
        __Pausable_init();
        transferOwnership(_owner);
        router = ISwapRouter(_router);
        for (uint i; i < _acceptedTokens.length; i++) {
            acceptedTokens[_acceptedTokens[i]] = true;
        }
    }

    constructor() {
        _disableInitializers();
    }

    /*///////////////////////////////////////////////
                    VALIDATION
*/ //////////////////////////////////////////////

    modifier acceptedTokensOnly(bytes memory path) {
        _validateNextToken(path);
        _;
    }

    function _validateNextToken(
        bytes memory path
    ) internal returns (bytes memory pathSlice) {
        (address tokenA, address tokenB, ) = path.decodeFirstPool();
        if (!acceptedTokens[tokenA]) revert UnacceptedToken();
        if (!acceptedTokens[tokenB]) revert UnacceptedToken();
        pathSlice = path.skipToken();
        if (!_isEmptyBytes(pathSlice)) {
            _validateNextToken(pathSlice);
        }
    }

    function _isEmptyBytes(bytes memory b) internal pure returns (bool) {
        return keccak256(b) == keccak256(bytes(""));
    }

    /*///////////////////////////////////////////////
                EXTERNAL METHODS
*/ //////////////////////////////////////////////

    function swapInExactV3(
        uint amountIn,
        uint amountOutMin,
        bytes calldata path
    ) external whenNotPaused nonReentrant acceptedTokensOnly(path) {
        ISwapRouter.ExactInputParams memory params = ISwapRouter
            .ExactInputParams({
                path: path,
                recipient: msg.sender,
                deadline: block.timestamp,
                amountIn: amountIn,
                amountOutMinimum: amountOutMin
            });

        uint256 amountOut = router.exactInput(params);

        emit Swap(path, amountIn, amountOut);
    }

    function swapOutExactV3(
        uint amountOut,
        uint amountInMax,
        bytes calldata path
    ) external whenNotPaused nonReentrant acceptedTokensOnly(path) {
        ISwapRouter.ExactOutputParams memory params = ISwapRouter
            .ExactOutputParams({
                path: path,
                recipient: msg.sender,
                deadline: block.timestamp,
                amountOut: amountOut,
                amountInMaximum: amountInMax
            });

        uint256 amountIn = router.exactOutput(params);

        emit Swap(path, amountIn, amountOut);
    }

    /*///////////////////////////////////////////////
                    ADMIN
*/ //////////////////////////////////////////////

    function modifyTokenAcceptance(
        address token,
        bool accepted
    ) external onlyOwner {
        acceptedTokens[token] = accepted;

        emit TokenApprovalChanged(token, accepted);
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }
}
