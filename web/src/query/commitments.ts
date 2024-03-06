import { Commitment } from '../state/atoms';

export interface CommitmentsQuery {
  commitments: Commitment[];
};

export const CommitmentsQueryDocument = /* GraphQL */ `
  query Commitments($lastLeafIndex: Int!, $contractAddress: String!, $batchSize: Int! $skip: Int!) {
    commitments(
      first: $batchSize
      skip: $skip
      orderBy: leafIndex
      where: { pool: $contractAddress, leafIndex_gt: $lastLeafIndex }
    ) {
      leafIndex
      commitment
      sender
      asset
      denomination
      leaf
      pool {
        id
      }
    }
  }
`;
