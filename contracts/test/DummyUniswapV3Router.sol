// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {ISwapRouter} from "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";

contract DummyUniswapV3Router is ISwapRouter {
    function exactInputSingle(
        ExactInputSingleParams calldata
    ) external payable returns (uint256 amountOut) {
        return 0;
    }

    function exactInput(
        ExactInputParams calldata
    ) external payable returns (uint256 amountOut) {
        return 0;
    }

    function exactOutputSingle(
        ExactOutputSingleParams calldata
    ) external payable returns (uint256 amountIn) {
        return 0;
    }

    function exactOutput(
        ExactOutputParams calldata
    ) external payable returns (uint256 amountIn) {
        return 0;
    }
    function uniswapV3SwapCallback(
        int256 amount0Delta,
        int256 amount1Delta,
        bytes calldata data
    ) external {}
}
