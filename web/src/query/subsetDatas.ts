export interface SubsetDataByNullifierQuery {
  subsetDatas: {
    accessType: number;
    bitLength: number;
    subsetData: string;
  }[];
}

export const SubsetDataByNullifierQueryDocument = /* GraphQL */ `
  query SubsetDataByNullifier(
    $contractAddress: Bytes!
    $subsetRoot: Bytes!
    $nullifier: Bytes!
  ) {
    subsetDatas(
      where: {
        pool: $contractAddress
        subsetRoot: $subsetRoot
        nullifier: $nullifier
      }
    ) {
      accessType
      bitLength
      subsetData
    }
  }
`;
