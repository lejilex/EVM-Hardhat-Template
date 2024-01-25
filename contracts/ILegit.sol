// SPDX-License-Identifier: MIT
// author: @stevieraykatz
pragma solidity ^0.8.19;


interface ILegit {

    event Swap(address indexed from, address indexed to, uint amountIn, uint amountOut);
    event TokenApprovalChanged(address indexed token, bool acceptance); 

    error UnacceptedToken();

    function swapInExact(
        uint amountIn,
        uint amountOutMin,
        address from,
        address to
    ) external returns(uint);

    function swapOutExact(
        uint amountOut,
        uint amountInMax,
        address from,
        address to
    ) external returns(uint);
}