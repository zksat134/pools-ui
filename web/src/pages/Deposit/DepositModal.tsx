import { Container } from '@chakra-ui/react';
import { isAddress } from 'ethers/lib/utils';
import { useAtom } from 'jotai';
import { Address, useContractReads, usePublicClient } from 'wagmi';
import { DepositMainContainer } from './DepositMainContainer';
import { DepositButton } from './DepositButton';
import { privacyPoolABI } from '../../constants';
import { useAsset, useContractAddress } from '../../hooks';
import { assetSymbolAtom, denominationAtom } from '../../state/atoms';

export function DepositModal() {
  const asset = useAsset();
  const [assetSymbol] = useAtom(assetSymbolAtom);
  const { chain } = usePublicClient();
  const { contractAddress } = useContractAddress();
  const [denomination] = useAtom(denominationAtom);

  const {
    data: poolData,
    isError: isPoolDataError,
    isLoading: isPoolDataLoading
  } = useContractReads({
    contracts: [
      {
        address: contractAddress as Address,
        abi: privacyPoolABI as any,
        functionName: 'getLatestRoot'
      } as const,
      {
        address: contractAddress as Address,
        abi: privacyPoolABI as any,
        functionName: 'currentLeafIndex'
      } as const,
    ] as const,
    enabled: typeof chain?.id === 'number' && isAddress(contractAddress),
    watch: true,
  });

  return (
    <>
      <Container minW="216px" maxW="98vw">
        <Container
          bg="white"
          px={0}
          my={8}
          borderRadius={10}
          boxShadow="2xl"
        >
          <DepositMainContainer
            assetSymbol={assetSymbol}
            asset={asset}
            denomination={denomination}
            contractAddress={contractAddress}
            poolData={poolData}
            isPoolDataError={isPoolDataError}
            isPoolDataLoading={isPoolDataLoading}
          />
          <DepositButton
            assetSymbol={assetSymbol}
            asset={asset}
            denomination={denomination}
            contractAddress={contractAddress}
            poolData={poolData}
          />
        </Container>
      </Container>
    </>
  );
}
