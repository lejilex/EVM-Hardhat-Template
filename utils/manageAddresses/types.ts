type Proxied = {
  implementation: string;
  proxy: string;
};

export type AddressObj = {
  LegitExchange: Proxied;
  uniswap: string;
  tokens: {
    usdc: string;
    weth: string;
  };
};
