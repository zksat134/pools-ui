import { sepolia } from 'wagmi';
export { privacyPoolABI } from './abis/privacyPoolAbi';
export { privacyPoolFactoryAbi } from './abis/privacyPoolFactoryAbi';
import { MerkleTree } from 'pools-ts';

interface Denominations {
  [chainId: number]: { [asset: string]: number[] };
}

interface Contracts {
  [chainId: number]: { [poolName: string]: string };
}

export const NATIVE: string = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';

export const denominations: Denominations = {
  [sepolia.id]: {
    SEP: [0.001]
  }
};

export const privacyPoolFactories: { [chainId: number]: string } = {
  [sepolia.id]: '0x2aC6a54C14FA95eAbCfC7217F917c1b7649C2D12'
};

export const contracts: Contracts = {
  [sepolia.id]: {
    'SEP-0.001': '0xF3B54CBbC12ce519cf4c8816e06F4bfe84538fca',
  }
};

export interface InnerTree { [contract: string]: MerkleTree };

export interface DepositsTrees { [chainId: number]: InnerTree };

export const getEmptyDepositsTree = () => {
  let trees: DepositsTrees = {}
  for (const chainId in contracts) {
    const newInnerTree: InnerTree = {};
    if (contracts.hasOwnProperty(chainId)) {
      for (const [_, value] of Object.entries(contracts[chainId])) {
        newInnerTree[value] = new MerkleTree({ leaves: [] });
      }
    }
    trees[chainId] = newInnerTree;
  }
  return trees;
};
