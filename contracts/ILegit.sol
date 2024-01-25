// SPDX-License-Identifier: MIT
// author: @stevieraykatz
pragma solidity ^0.8.19;

interface ILegit {
    event Swap(
        address[] path,
        uint[] amounts
    );
    event TokenApprovalChanged(address indexed token, bool acceptance);

    error UnacceptedToken();

    function swapInExact(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path
    ) external returns (uint);

    function swapOutExact(
        uint amountOut,
        uint amountInMax,
        address[] calldata path
    ) external returns (uint);
}
