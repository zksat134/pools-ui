import { useEffect } from 'react';
import { useQuery } from 'urql';
import { useAtom } from 'jotai';
import brotliPromise from 'brotli-wasm';
import { recentWithdrawalAtom, subsetMetadataAtom } from '../state';
import { useContractAddress } from '.';
import {
  SubsetDataByNullifierQuery,
  SubsetDataByNullifierQueryDocument
} from '../query';

export function useSubsetDataByNullifier() {
  const [recentWithdrawal] = useAtom(recentWithdrawalAtom);
  const [subsetMetadata, setSubsetMetadata] = useAtom(subsetMetadataAtom);

  const { contractAddress } = useContractAddress();

  const [result, executeSubsetDatasQuery] =
    useQuery<SubsetDataByNullifierQuery>({
      query: SubsetDataByNullifierQueryDocument,
      variables: {
        contractAddress: contractAddress.toLowerCase(),
        nullifier: recentWithdrawal.nullifier.toLowerCase(),
        subsetRoot: recentWithdrawal.subsetRoot.toLowerCase()
      },
      requestPolicy: 'cache-and-network',
    });

  useEffect(() => {
    executeSubsetDatasQuery({
      contractAddress: contractAddress.toLowerCase(),
      nullifier: recentWithdrawal.nullifier.toLowerCase(),
      subsetRoot: recentWithdrawal.subsetRoot.toLowerCase()
    });

  }, [executeSubsetDatasQuery, recentWithdrawal, contractAddress]);

  interface SubsetData {
    accessType: number;
    bitLength: number;
    subsetData: string;
  }

  const decompressSubsetData = async(data: SubsetData) => {
    const subsetData = Buffer.from(data.subsetData.slice(2), 'hex')
    const brotli = await brotliPromise;
    const decompressedData = brotli.decompress(subsetData);
    const buffer = Buffer.from(decompressedData)
    setSubsetMetadata({
      accessType: data.accessType === 0 ? 'blocklist' : 'allowlist',
      bitLength: data.bitLength,
      subsetData: buffer
    })
  }

  useEffect(() => {
    if (
      Array.isArray(result?.data?.subsetDatas) &&
      result!.data!.subsetDatas.length === 1
    ) {
      // decompress subsetData using brotli
      decompressSubsetData(result!.data!.subsetDatas[0])
    } else {
      setSubsetMetadata({
        accessType: 'blocklist',
        bitLength: NaN,
        subsetData: Buffer.alloc(0)
      });
    }
  }, [result, setSubsetMetadata]);

  return { subsetMetadata, executeSubsetDatasQuery };
}
