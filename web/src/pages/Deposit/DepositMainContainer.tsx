import { ChevronDownIcon, ExternalLinkIcon, QuestionOutlineIcon } from '@chakra-ui/icons';
import {
  Box,
  Container,
  Flex,
  Heading,
  HStack,
  Link,
  Text,
  Tooltip,
  VStack,
  Select,
  Spinner,
} from '@chakra-ui/react';
import { hexZeroPad, isAddress } from 'ethers/lib/utils';
import { useAtom } from 'jotai';
import {
  Address,
  useBalance,
  usePublicClient,
} from 'wagmi';
import { Logo } from '../../components/Logo';
import { Token } from '../../constants/tokens';
import { NATIVE } from '../../constants';
import { useNote, useOptions } from '../../hooks';
import { assetSymbolAtom, denominationAtom } from '../../state/atoms';
import { pinchString } from '../../utils';

interface DepositMainContainerProps {
  assetSymbol: string;
  denomination: string;
  contractAddress: string;
  poolData: any[] | undefined;
  isPoolDataError: boolean;
  isPoolDataLoading: boolean;
  asset?: Token;
}

export const DepositMainContainer: React.FC<DepositMainContainerProps> = ({
  asset,
  contractAddress,
  poolData,
  isPoolDataError,
  isPoolDataLoading
}) => {
  const [assetSymbol, setAssetSymbol] = useAtom(assetSymbolAtom);
  const { assetOptions, denominationOptions } = useOptions();
  const [denomination, setDenomination] = useAtom(denominationAtom);
  const { chain } = usePublicClient();
  const { commitment } = useNote();

  const {
    data: poolBalanceData,
    isLoading: isPoolBalanceLoading,
    isError: isPoolBalanceError
  } = useBalance({
    address: contractAddress as Address,
    token: asset?.address === NATIVE ? undefined : asset?.address as Address,
    enabled: isAddress(contractAddress) && !!asset && isAddress(asset.address),
    watch: true
  });

  return (
    <VStack w="full" pt={4} px={4}>
      <Heading fontSize="2xl">
        <Flex alignItems='center'>
          <Logo uri={asset?.url} />
          <Text pl={2}>
            {assetSymbol} {denomination} Pool
          </Text>
        </Flex>
      </Heading>
      <Link
        isExternal
        href={`${chain?.blockExplorers?.default.url}/address/${contractAddress}`}
      >
        <Flex alignItems='center'>
          <Text color="gray.800" fontWeight="bold" wordBreak="break-all">
            {pinchString(contractAddress, 8)}
          </Text>
          <ExternalLinkIcon pl='2px' pb='2px' />
        </Flex>
      </Link>
      <Container px={0} py={2}>
        <HStack w="full">
          <VStack w="50%" alignItems="flex-start">
            <Flex alignItems="center">
              <Tooltip label="Select an asset of the pool for deposit.">
                <QuestionOutlineIcon />
              </Tooltip>
              <Text fontSize="md" ml={1}>Asset</Text>
            </Flex>
            <Select
              size="md"
              bg="gray.100"
              onChange={(e) => setAssetSymbol(e.target.value)}
              defaultValue={assetSymbol}
              icon={<>
                <Logo uri={asset?.url} />
                <ChevronDownIcon style={{ marginRight: "1rem" }} />
              </>}
            >
              {assetOptions.map((_asset, i) => (
                <option
                  value={_asset.address}
                  key={`${_asset}-${i}-option`}
                >
                  {_asset.symbol.toString()}
                </option>
              ))}
            </Select>
          </VStack>
          <VStack w="50%" alignItems="flex-start">
            <Flex alignItems="center">
              <Tooltip label="Select the denomination of an asset for deposit. Each denomination represents a separate pool, and this value includes any potential fee.">
                <QuestionOutlineIcon />
              </Tooltip>
              <Text fontSize="md" ml={1}>Denomination</Text>
            </Flex>
            <Select
              size="md"
              bg="gray.50"
              onChange={(e) => setDenomination(e.target.value)}
              defaultValue={denomination}
            >
              {denominationOptions.map((_denomination, i) => (
                <option
                  value={_denomination}
                  key={`${_denomination}-${i}-option`}
                >
                  {_denomination.toString()}
                </option>
              ))}
            </Select>
          </VStack>
        </HStack>
      </Container>
      <HStack w="full" justify="space-between" py={2}>
        <VStack>
          <HStack>
            <Tooltip
              label={`The current number of deposits that have joined the pool. Higher is better!`}
            >
              <QuestionOutlineIcon />
            </Tooltip>
            <Text fontSize="md">Pool Size</Text>
          </HStack>
          <Flex>
            {isPoolDataLoading ? (
              <Spinner />
            ) : isPoolDataError ? (
              <Text fontWeight="bold">--</Text>
            ) : <Text fontWeight="bold">{poolData?.[1].result?.toString() || 0}</Text>}
          </Flex>
        </VStack>
        <VStack>
          <HStack>
            <Tooltip
              label={`The commitment is publicly recorded in the privacy pool.`}
            >
              <QuestionOutlineIcon />
            </Tooltip>
            <Text fontSize="md">Commitment</Text>
          </HStack>

          <Tooltip label={hexZeroPad(commitment.toHexString(), 32)}>
            <Text
              fontSize="lg"
              sx={{ wordBreak: 'break-word' }}
              fontWeight="bold"
              _hover={{ color: 'gray.500' }}
            >
              {pinchString(hexZeroPad(commitment.toHexString(), 32), 6)}
            </Text>
          </Tooltip>
        </VStack>
      </HStack>

      <HStack w="full" justify="space-between" py={2}>
        <VStack>
          <HStack>
            <Tooltip
              label={`The current balance of the pool. Fluctuates depending on how many depositors are waiting to withdraw.`}
            >
              <QuestionOutlineIcon />
            </Tooltip>
            <Text fontSize="md">Pool Balance</Text>
          </HStack>
          <Flex>
            {isPoolBalanceLoading ? (
              <Spinner />
            ) : isPoolBalanceError ? (
              <Text fontWeight="bold">--</Text>
            ) : (
              <Text fontWeight="bold">{poolBalanceData?.formatted}</Text>
            )}
            <Text fontWeight="bold" ml="2px">
              {poolBalanceData?.symbol === assetSymbol
                ? ` ${assetSymbol}`
                : ` ${poolBalanceData?.symbol} (${assetSymbol})`}
            </Text>
          </Flex>
        </VStack>
        <VStack>
          <HStack>
            <Tooltip
              label={`The current merkle root of deposits that have joined the pool. Used in zero knowledge to prove that the commitment is deposited in the pool.`}
            >
              <QuestionOutlineIcon />
            </Tooltip>
            <Text fontSize="md">Root</Text>
          </HStack>
          <Tooltip
            label={((poolData?.[0].result) || 0)}
          >
            <Flex>
              {isPoolDataLoading ? (
                <Spinner />
              ) : isPoolDataError ? (
                <Text>--</Text>
              ) :
                <Text
                  fontSize="lg"
                  sx={{ wordBreak: 'break-word' }}
                  fontWeight="bold"
                  _hover={{ color: 'gray.500' }}
                >{pinchString(((poolData?.[0].result) || 0).toString(), 6)}</Text>
              }
            </Flex>
          </Tooltip>
        </VStack>
      </HStack>
    </VStack>
  )
}
