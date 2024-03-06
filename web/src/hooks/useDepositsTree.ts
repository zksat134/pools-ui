import { useEffect } from 'react';
import { useAtom } from 'jotai';
import { MerkleTree } from 'pools-ts';
import { getAddress, hexZeroPad } from 'ethers/lib/utils';
import { usePublicClient } from 'wagmi';
import { depositsTreeAtom, Commitment } from '../state';
import { useCommitments, useContractAddress, useDebounce } from '.';

export function useDepositsTree() {
  const [depositsTree, setDepositsTree] = useAtom(depositsTreeAtom);
  const { chain } = usePublicClient();
  const { commitments } = useCommitments();
  const { contractAddress } = useContractAddress();
  const debouncedCommitments = useDebounce<Commitment[]>(commitments, 500);

  useEffect(() => {
    if (chain && debouncedCommitments && debouncedCommitments.length > 0 && contractAddress === getAddress(debouncedCommitments[0].pool.id)) {
      if (depositsTree[chain.id][contractAddress].length === 0) {
        const tree = new MerkleTree({
          leaves: debouncedCommitments.map(({ leaf }) =>
            hexZeroPad(leaf.toString(), 32)
          ),
          zeroString: 'empty'
        });
        const newTree = depositsTree;
        newTree[chain.id][contractAddress] = tree;
        setDepositsTree(newTree);
      } else if (depositsTree[chain.id][contractAddress].length < debouncedCommitments.length) {
        const tree = MerkleTree.fromJSON(depositsTree[chain.id][contractAddress].toJSON());
        for (
          let i = depositsTree[chain.id][contractAddress].length;
          i < debouncedCommitments.length;
          i++
        ) {
          tree.insert(debouncedCommitments[i].leaf);
        }
        const newTree = depositsTree;
        newTree[chain.id][contractAddress] = tree;
        setDepositsTree(newTree);
      }
    }
  }, [chain, contractAddress, debouncedCommitments, depositsTree, setDepositsTree]);

  return { depositsTree };
}
