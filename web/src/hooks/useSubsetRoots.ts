import { useEffect } from 'react';
import { useAtom } from 'jotai';
import { useQuery } from 'urql';
import { subsetRootsAtom } from '../state/atoms';
import { useContractAddress } from '.';
import {
  SubsetRootsByPoolQuery,
  SubsetRootsByPool
} from '../query';

export function useSubsetRoots() {
  const [subsetRoots, setSubsetRoots] = useAtom(subsetRootsAtom);
  const { contractAddress } = useContractAddress();

  const [result, executeSubsetRootsQuery] =
    useQuery<SubsetRootsByPoolQuery>({
      query: SubsetRootsByPool,
      variables: {
        timestamp: 0,
        contractAddress: contractAddress.toLowerCase()
      },
      requestPolicy: 'cache-and-network',
    });

  useEffect(() => {
    if (Array.isArray(result?.data?.subsetDatas)) {
      setSubsetRoots(result!.data!.subsetDatas);
    }
  }, [result, setSubsetRoots]);

  return { subsetRoots, executeSubsetRootsQuery };
}
