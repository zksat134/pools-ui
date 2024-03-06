import { useEffect } from 'react';
import { useAtom } from 'jotai';
import { useQuery } from 'urql';
import { commitmentsAtom } from '../state/atoms';
import { useContractAddress } from '.';
import { CommitmentsQuery, CommitmentsQueryDocument } from '../query';

const batchSize = 1000;

export function useCommitments() {
  const [commitments, setCommitments] = useAtom(commitmentsAtom);
  const { contractAddress } = useContractAddress();

  const [result, executeCommitmentsQuery] = useQuery<CommitmentsQuery>({
    query: CommitmentsQueryDocument,
    variables: {
      lastLeafIndex: -1,
      contractAddress: contractAddress.toLowerCase(),
      batchSize,
      skip: commitments.length
    },
    requestPolicy: 'cache-and-network',
  });

  useEffect(() => {
    if (
      !result.fetching && 
      result?.data?.commitments && 
      result?.data?.commitments.length > 0 && 
      Array.isArray(result?.data?.commitments)
    ) {
      setCommitments([...commitments, ...result!.data!.commitments]);
    }
  }, [result, setCommitments]);

  return { commitments, executeCommitmentsQuery };
}
