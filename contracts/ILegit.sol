// SPDX-License-Identifier: MIT
// author: @stevieraykatz
pragma solidity ^0.8.19;

interface ILegit {
    event Swap(bytes path, uint amountIn, uint amountout);
    event TokenApprovalChanged(address indexed token, bool acceptance);

    error UnacceptedToken();

    function swapInExactV3(
        uint amountIn,
        uint amountOutMin,
        bytes calldata path
    ) external;

    function swapOutExactV3(
        uint amountOut,
        uint amountInMax,
        bytes calldata path
    ) external;
}
