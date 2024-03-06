import { SubsetRoot } from '../state/atoms';

export interface SubsetRootsByPoolQuery {
  subsetDatas: SubsetRoot[];
};

export const SubsetRootsByPool = /* GraphQL */ `
  query SubsetRootsByTimestamp($timestamp: BigInt, $contractAddress: Bytes!) {
    subsetDatas(
      orderBy: timestamp
      pool: $contractAddress
      where: {
        pool: $contractAddress
        timestamp_gt: $timestamp
      }
    ) {
      subsetRoot
      relayer
      recipient
      nullifier
      sender
    }
  }
`;

export interface SubsetRootsByTimestampQuery {
  subsetDatas: SubsetRoot[];
};

export const SubsetRootsByTimestampDocument = /* GraphQL */ `
  query SubsetRootsByTimestamp($timestamp: BigInt, $contractAddress: Bytes!) {
    subsetDatas(
      orderBy: timestamp
      pool: $contractAddress
      where: { timestamp_gt: $timestamp }
    ) {
      subsetRoot
      relayer
      recipient
      nullifier
      sender
    }
  }
`;

export interface SubsetRootsByRelayerQuery {
  subsetDatas: {
    subsetRoot: string;
    recipient: string;
    nullifier: string;
    sender: string;
  };
};

export const SubsetRootsByRelayerDocument = /* GraphQL */ `
  query SubsetRootsByRelayer(
    $timestamp: BigInt
    $contractAddress: Bytes!
    $relayer: Bytes!
  ) {
    subsetDatas(
      orderBy: timestamp
      where: {
        pool: $contractAddress
        timestamp_gt: $timestamp
        relayer: $relayer
      }
    ) {
      subsetRoot
      recipient
      nullifier
      sender
    }
  }
`;

export interface SubsetRootsBySenderQuery {
  subsetDatas: {
    subsetRoot: string;
    relayer: string;
    recipient: string;
    nullifier: string;
  };
};

export const SubsetRootsBySenderDocument = /* GraphQL */ `
  query SubsetRootsBySender(
    $timestamp: BigInt
    $contractAddress: Bytes!
    $sender: Bytes!
  ) {
    subsetDatas(
      orderBy: timestamp
      where: {
        pool: $contractAddress
        timestamp_gt: $timestamp
        sender: $sender
      }
    ) {
      subsetRoot
      recipient
      nullifier
      relayer
    }
  }
`;
