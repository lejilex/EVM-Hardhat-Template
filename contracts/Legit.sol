// SPDX-License-Identifier: MIT
// author: @stevieraykatz
pragma solidity ^0.8.19;

import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import {PausableUpgradeable} from "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {ILegit} from "./ILegit.sol";
import {IUniswapV2Router} from "./interfaces/IUniswapV2Router.sol";

contract Legit is
    OwnableUpgradeable,
    PausableUpgradeable,
    ReentrancyGuard,
    ILegit
{
    using SafeERC20 for IERC20;

    /*///////////////////////////////////////////////
                    STORAGE
*/ //////////////////////////////////////////////

    mapping(address => bool) public acceptedTokens; // slot ...offset + 0
    IUniswapV2Router private router;                // slot ...offset + 1
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
        router = IUniswapV2Router(_router);
        for (uint i; i < _acceptedTokens.length; i++) {
            acceptedTokens[_acceptedTokens[i]] = true;
        }
    }

    constructor() {
        _disableInitializers();
    }

    /*///////////////////////////////////////////////
                    MODIFIERS
*/ //////////////////////////////////////////////

    modifier acceptedTokensOnly(address[] calldata path) {
        for(uint i; i < path.length; i++) {
            if (!acceptedTokens[path[i]]) revert UnacceptedToken();
        }
        _;
    }

    /*///////////////////////////////////////////////
                EXTERNAL METHODS
*/ //////////////////////////////////////////////

    function swapInExact(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path
    )
        external
        whenNotPaused
        nonReentrant
        acceptedTokensOnly(path)
        returns (uint)
    {
        IERC20(path[0]).safeTransferFrom(msg.sender, address(this), amountIn);
        IERC20(path[0]).safeApprove(address(router), amountIn);

        uint[] memory amounts = router.swapExactTokensForTokens(
            amountIn,
            amountOutMin,
            path,
            msg.sender,
            block.timestamp
        );

        emit Swap(path, amounts);

        return amounts[1];
    }

    function swapOutExact(
        uint amountOut,
        uint amountInMax,
        address[] calldata path
    )
        external
        whenNotPaused
        nonReentrant
        acceptedTokensOnly(path)
        returns (uint)
    {
        IERC20(path[0]).safeTransferFrom(msg.sender, address(this), amountInMax);
        IERC20(path[0]).safeApprove(address(router), amountInMax);

        uint[] memory amounts = router.swapTokensForExactTokens(
            amountOut,
            amountInMax,
            path,
            msg.sender,
            block.timestamp
        );

        if (amounts[0] < amountInMax) {
            uint refundAmount = amountInMax - amounts[0];
            IERC20(path[0]).safeTransfer(msg.sender, refundAmount);
        }

        emit Swap(path, amounts);

        return amounts[1];
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
