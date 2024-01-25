// SPDX-License-Identifier: MIT
// author: @stevieraykatz
pragma solidity ^0.8.19;

import {Initializable} from "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Pausable} from "@openzeppelin/contracts/security/Pausable.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {ILegit} from "./ILegit.sol";
import {IUniswapV2Router} from "./interfaces/IUniswapV2Router.sol";

contract Legit is Initializable, Ownable, Pausable, ReentrancyGuard, ILegit {

    using SafeERC20 for IERC20;

/*///////////////////////////////////////////////
                    STORAGE
*/ //////////////////////////////////////////////

    mapping(address => bool) approvedTokens;
    IUniswapV2Router router;


/*///////////////////////////////////////////////
                    PROXY INIT
*/ //////////////////////////////////////////////

    function initialize(
        address _owner, 
        address[] calldata _approvedTokens,
        address _router
    ) public initializer {
        transferOwnership(_owner);
        router = IUniswapV2Router(_router);
        for(uint i; i < _approvedTokens.length; i++) {
            approvedTokens[_approvedTokens[i]] = true;
        }
    }
    
    constructor () {
        _disableInitializers();
    }

/*///////////////////////////////////////////////
                    MODIFIERS
*/ //////////////////////////////////////////////

    modifier acceptedTokensOnly(address from, address to) {
        if(!approvedTokens[from]) revert UnacceptedToken();
        if(!approvedTokens[to]) revert UnacceptedToken();
        _;
    }

/*///////////////////////////////////////////////
                EXTERNAL METHODS
*/ //////////////////////////////////////////////

    function swapInExact(
        uint amountIn,
        uint amountOutMin,
        address from,
        address to
    ) external whenNotPaused nonReentrant acceptedTokensOnly(from,to) returns(uint) {
        IERC20(from).safeTransferFrom(msg.sender, address(this), amountIn);        
        IERC20(from).safeApprove(address(router), amountIn);
        
        address[] memory path = new address[](2);
        path[0] = from;
        path[1] = to;

        uint[] memory amounts = router.swapExactTokensForTokens(
            amountIn, 
            amountOutMin,
            path,
            msg.sender,
            block.timestamp
        );

        emit Swap(from, to, amountIn, amounts[1]);

        return amounts[1];
    }

    function swapOutExact(
        uint amountOut,
        uint amountInMax,
        address from,
        address to
    ) external whenNotPaused nonReentrant acceptedTokensOnly(from,to) returns(uint) {
        IERC20(from).safeTransferFrom(msg.sender, address(this), amountInMax);        
        IERC20(from).safeApprove(address(router), amountInMax);
        
        address[] memory path = new address[](2);
        path[0] = from;
        path[1] = to;

        uint[] memory amounts = router.swapTokensForExactTokens(
            amountOut, 
            amountInMax,
            path,
            msg.sender,
            block.timestamp
        );

        if (amounts[0] < amountInMax) {
            uint refundAmount = amountInMax - amounts[0];
            IERC20(from).safeTransfer(msg.sender, refundAmount);
        }

        emit Swap(from, to, amounts[0], amounts[1]);

        return amounts[1];
    }
/*///////////////////////////////////////////////
                    ADMIN
*/ //////////////////////////////////////////////

    function modifyTokenAcceptance(address token, bool accepted) external onlyOwner {
        approvedTokens[token] = accepted;

        emit TokenApprovalChanged(token, accepted);
    } 

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }
}