import { ExternalLinkIcon } from '@chakra-ui/icons';
import {
  Button,
  Box,
  Center,
  HStack,
  Link,
  Stack,
  Text,
  VStack,
  Spinner,
} from '@chakra-ui/react';
import { useAddRecentTransaction } from '@rainbow-me/rainbowkit';
import { BigNumber } from 'ethers';
import { parseUnits, hexZeroPad, isAddress } from 'ethers/lib/utils';
import { useMemo } from 'react'
import toast from 'react-hot-toast';
import {
  Address,
  erc20ABI,
  useAccount,
  useNetwork,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
  useContractRead,
  useBalance,
} from 'wagmi';
import ConnectButton from '../../components/ConnectButton';
import { NoteWalletConnectButton } from '../../components/NoteWallet/NoteWalletConnectButton';
import { NATIVE, privacyPoolABI } from '../../constants';
import { Token } from '../../constants/tokens';
import { useNote } from '../../hooks';

interface DepositButtonProps {
  assetSymbol: string;
  denomination: string;
  contractAddress: string;
  poolData: any[] | undefined;
  asset?: Token;
}

export const DepositButton: React.FC<DepositButtonProps> = ({
  assetSymbol,
  asset,
  denomination,
  contractAddress,
  poolData
}) => {
  const account = useAccount();
  const { chain } = useNetwork();
  const { commitment } = useNote();
  const addRecentTransaction = useAddRecentTransaction();

  const parsedAmount = useMemo(() => {
    return parseUnits(denomination, asset?.decimals).toString()
  }, [asset, denomination])

  const {
    data: userBalanceData,
    isLoading: isUserBalanceLoading
  } = useBalance({
    address: account.address as Address,
    token: asset?.address === NATIVE ? undefined : asset?.address as Address,
    enabled: account.isConnected && !!asset && isAddress(asset.address),
    watch: true
  });

  const notEnoughBalance = useMemo(() => {
    if (poolData && userBalanceData && !isUserBalanceLoading) {
      return BigNumber.from(parsedAmount).gt(userBalanceData.value) ? true : false
    }
    return false
  }, [isUserBalanceLoading, parsedAmount, poolData, userBalanceData])

  const { data: approveData, isLoading: approveDataIsLoading } = useContractRead({
    address: asset?.address as Address,
    abi: erc20ABI,
    functionName: 'allowance',
    args: [account.address as Address, contractAddress as Address],
    enabled: !isUserBalanceLoading && account.isConnected && asset?.address !== NATIVE,
    watch: true,
  })

  const approveState = useMemo(() => {
    if (
      chain &&
      asset &&
      poolData &&
      approveData !== undefined &&
      !approveDataIsLoading &&
      asset.address !== NATIVE
    ) {
      const amount = BigInt(parsedAmount)
      if (approveData >= amount) {
        return { approved: true, amountToApprove: 0n }
      } else if (approveData < amount) {
        const diff = amount - approveData
        return { approved: false, amountToApprove: diff }
      }
    }
    return { approved: undefined, amountToApprove: 0n }
  }, [approveData, approveDataIsLoading, asset, chain, parsedAmount, poolData])

  const { config: handleApproveConfig } = usePrepareContractWrite({
    address: asset?.address as Address,
    abi: erc20ABI,
    functionName: 'approve',
    args: [contractAddress as Address, approveState.amountToApprove],
    enabled: !isUserBalanceLoading && approveData !== undefined && !approveDataIsLoading && !notEnoughBalance,
    onError() {
      toast.error('There was an error preparing the transaction.', {
        duration: 1000
      });
    }
  });

  const { data: handleApproveData, write: handleApprove } = useContractWrite({
    ...handleApproveConfig,
    onError() {
      toast.error('Failed to send transaction.');
    }
  });

  const { isLoading: isHandleApproveLoading } = useWaitForTransaction({
    hash: handleApproveData?.hash,
    onSuccess() {
      addRecentTransaction({
        hash: handleApproveData!.hash,
        description: 'Deposit'
      });
      toast.success(
        <HStack w="full" justify="space-evenly">
          <VStack>
            <Text color="green.600">Deposit succeeded!</Text>
            <Link
              w="full"
              isExternal
              href={`${chain?.blockExplorers?.default.url}/tx/${handleApproveData?.hash}`}
            >
              <Text color="gray.800">
                View on Etherscan <ExternalLinkIcon mx="2px" color="blue.600" />
              </Text>
            </Link>
          </VStack>
        </HStack>,
        { duration: 10000, style: { width: '100%' } }
      );
    }
  });

  const { config, isError: isPrepareError } = usePrepareContractWrite({
    address: contractAddress as Address,
    abi: privacyPoolABI,
    functionName: 'deposit',
    args: [hexZeroPad(commitment.toHexString(), 32) as Address],
    enabled:
      !isUserBalanceLoading &&
      Boolean(!commitment.eq(0)) &&
      typeof chain?.id === 'number' &&
      !notEnoughBalance &&
      isAddress(contractAddress) &&
      !approveDataIsLoading &&
      approveState &&
      approveState.approved,
    value: asset?.address === NATIVE && poolData ? BigInt(parsedAmount) : 0n,
    onError() {
      toast.error('There was an error preparing the transaction.', {
        duration: 1000
      });
    }
  });

  const { data, write } = useContractWrite({
    ...config,
    onError() {
      toast.error('Failed to send transaction.');
    }
  });

  const { isLoading } = useWaitForTransaction({
    hash: data?.hash,
    onSuccess() {
      addRecentTransaction({
        hash: data!.hash,
        description: 'Deposit'
      });
      toast.success(
        <HStack w="full" justify="space-evenly">
          <VStack>
            <Text color="green.600">Deposit succeeded!</Text>
            <Link
              w="full"
              isExternal
              href={`${chain?.blockExplorers?.default.url}/tx/${data?.hash}`}
            >
              <Text color="gray.800">
                View on Etherscan <ExternalLinkIcon mx="2px" color="blue.600" />
              </Text>
            </Link>
          </VStack>
        </HStack>,
        { duration: 10000, style: { width: '100%' } }
      );
    }
  });

  const isDepositDisabled = Boolean(
    isPrepareError || !write || isLoading || Boolean(commitment.eq(0))
  );

  return (
    <Box pb={3}>
      {!chain || chain?.unsupported || !account || !asset ?
        <Box pt={4} px={4}>
          <ConnectButton />
        </Box> : asset.address !== NATIVE ? (
          <>
            {!approveState.approved ? (
              <Stack>
                <Center h="100%" pt={4} px={4}>
                  {commitment.eq(0) ? (
                    <NoteWalletConnectButton buttonProps={{ width: "100%", height: "50px", size: "lg" }} />
                  ) : (
                    <Button
                      colorScheme="blue"
                      width="100%"
                      height="50px"
                      size="lg"
                      isDisabled={!Boolean(contractAddress) || notEnoughBalance}
                      onClick={() => handleApprove?.()}
                    >
                      {isHandleApproveLoading ? <Spinner /> : notEnoughBalance ? 'Insufficient balance' :
                      `Approve ${denomination} ${assetSymbol}`}
                    </Button>
                  )}
                </Center>
              </Stack>
            ) : (
              <Stack>
                <Center h="100%" pt={4} px={4}>
                  <Button
                    colorScheme="blue"
                    width="100%"
                    height="50px"
                    size="lg"
                    isDisabled={!Boolean(contractAddress) || notEnoughBalance}
                    onClick={() => {
                      write?.();
                    }}
                  >
                    {isLoading ? <Spinner /> : notEnoughBalance ? 'Insufficient balance' :
                    `Deposit ${denomination} ${assetSymbol}`}
                  </Button>
                </Center>
              </Stack>
            )}
          </>
        ) : (
          <Stack>
            <Center h="100%" pt={4} px={4}>
              {commitment.eq(0) ? (
                <NoteWalletConnectButton buttonProps={{ width: "100%", height: "50px", size: "lg" }} />
              ) : (
                <Button
                  colorScheme="blue"
                  width="100%"
                  height="50px"
                  size="lg"
                  isDisabled={isDepositDisabled || notEnoughBalance}
                  onClick={() => {
                    write?.()
                  }}
                >
                  {isLoading ? <Spinner /> : notEnoughBalance ? 'Insufficient balance' :
                  `Deposit ${denomination} ${assetSymbol}`}
                </Button>
              )}
            </Center>
          </Stack>
        )}
    </Box>
  )
}
