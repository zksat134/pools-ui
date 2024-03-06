import { sepolia } from 'wagmi';
import { NATIVE } from ".";

export interface Token {
  address: string,
  decimals: number,
  name: string,
  symbol: string,
  url?: string
};

interface TokenList {
  [chainId: number]: { [address: string]: Token };
}

export const tokens: TokenList = {
  [sepolia.id]: {
    'SEP': {
      address: NATIVE,
      decimals: 18,
      name: 'Sepolia Ether',
      symbol: 'SEP',
    },
  },
};
