import { ExternalLinkIcon, QuestionOutlineIcon, ChevronLeftIcon } from '@chakra-ui/icons';
import {
  Button,
  Center,
  Flex,
  HStack,
  VStack,
  Link,
  Stack,
  Text,
  Tooltip,
  Spinner,
  useBreakpointValue,
} from '@chakra-ui/react';
import { useAddRecentTransaction } from '@rainbow-me/rainbowkit';
import { formatUnits, getAddress, isAddress } from 'ethers/lib/utils';
import { useAtom } from 'jotai';
import { useState } from 'react';
import toast from 'react-hot-toast';
import {
  useAccount,
  usePublicClient,
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
  Address,
} from 'wagmi';
import ConnectButton from '../../components/ConnectButton';
import { Logo } from '../../components/Logo';
import { privacyPoolABI } from '../../constants';
import { useAsset, useContractAddress, useExistingCommitments } from '../../hooks';
import { assetSymbolAtom, denominationAtom, zkProofAtom } from '../../state';
import { exportToJson, truncateText } from '../../utils';

interface WithdrawExecuteProps {
  exportWithdrawData: boolean;
}

export const WithdrawExecute: React.FC<WithdrawExecuteProps> = ({ exportWithdrawData }) => {
  const [isDetailsCollapsed, setIsDetailsCollapsed] = useState<boolean>(true);
  const smallScreen = useBreakpointValue({ base: true, lg: false });
  const [zkProof, setZkProof] = useAtom(zkProofAtom);
  const [assetSymbol] = useAtom(assetSymbolAtom);
  const [denomination] = useAtom(denominationAtom);
  const asset = useAsset();
  const { chain } = usePublicClient();
  const account = useAccount();
  const { subsetFactory, contractAddress } = useContractAddress();
  const { existingCommitments } = useExistingCommitments();
  const addRecentTransaction = useAddRecentTransaction();

  const withdrawalProof = zkProof && {
    accessType: zkProof.metadata.accessType,
    bitLength: zkProof.metadata.bitLength,
    subsetData: zkProof.metadata.subsetData,
    flatProof: zkProof.solidityInput.flatProof,
    root: zkProof.solidityInput.root,
    subsetRoot: zkProof.solidityInput.subsetRoot,
    nullifier: zkProof.solidityInput.nullifier,
    recipient: zkProof.solidityInput.recipient,
    refund: zkProof.solidityInput.refund,
    relayer: zkProof.solidityInput.relayer,
    fee: zkProof.solidityInput.fee,
    deadline: zkProof.solidityInput.deadline,
  }

  const withdrawRequest = {
    proof: withdrawalProof,
    feeReceiver: '0x0000000000000000000000000000000000000000'
  }

  const { config, isError: isPrepareError } = usePrepareContractWrite({
    address: contractAddress as Address,
    abi: privacyPoolABI,
    functionName: 'withdraw',
    args: [withdrawRequest],
    enabled: Boolean(
      account.isConnected &&
      Boolean(zkProof) &&
      isAddress(zkProof!.metadata.contractAddress) &&
      isAddress(subsetFactory) &&
      Boolean(
        getAddress(zkProof!.metadata.contractAddress) ===
        getAddress(contractAddress)
      ) &&
      zkProof!.metadata.chainId === chain?.id
    ),
    onError() {
      toast.error('There was an error preparing the transaction.');
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
        description: 'Withdraw'
      });
      setZkProof(null);
      toast.success(
        <HStack w="full" justify="space-evenly">
          <VStack>
            <Text color="green.600">Withdraw succeeded!</Text>
            <Link
              w="full"
              isExternal
              href={`${chain?.blockExplorers?.default.url}/tx/${data?.hash}`}
            >
              <Text color="blue.600">
                View on Etherscan <ExternalLinkIcon mx="2px" color="blue.600" />
              </Text>
            </Link>
          </VStack>
        </HStack>,
        { duration: 30000, style: { width: '100%' } }
      );
    }
  });

  const isWithdrawDisabled = Boolean(
    !zkProof ||
    !write ||
    isPrepareError ||
    isLoading ||
    existingCommitments.length === 0
  );

  return (
    <Center>
      <VStack w="full">
        <Stack
          w="full"
          px={4}
          pt={3}
          pb={5}
          borderRadius={10}
          borderBottomRadius={0}
          bg="white"
        >
          <HStack>
            <Tooltip
              label={`Amount of ${assetSymbol} to be withdrawn from the pool. This amount includes fee if set.`}
            >
              <QuestionOutlineIcon />
            </Tooltip>
            <Text fontSize="md">Value</Text>
          </HStack>
          <Flex>
            <Flex
              justify="center"
              align="center"
              boxSize={8}
              minWidth={8}
              overflow="hidden"
              borderRadius="0"
            >
              <Logo uri={asset?.url} />
            </Flex>
            <Flex justify="center" align="center">
              <Text
                fontSize="lg"
                fontWeight="bold"
                marginLeft="5px"
                color="black"
              >
                {truncateText(denomination, smallScreen ? 21 : 35)}{' '}{assetSymbol}
              </Text>
            </Flex>
          </Flex>
          <HStack>
            <Tooltip
              label={`The recipient address should be a brand new Ethereum address with no activity at all. This is a new, unlinked address.`}
            >
              <QuestionOutlineIcon />
            </Tooltip>
            <Text fontSize="md">Recipient</Text>
          </HStack>
          <Text
            bg="gray.50"
            borderRadius={6}
            p={2}
            px={4}
            border="solid 1px rgba(42, 42, 42, 0.25)"
            fontWeight="bold"
            fontSize="md"
            wordBreak="break-word"
          >
            {zkProof?.solidityInput.recipient}
          </Text>

          <Button
            onClick={() => setIsDetailsCollapsed(!isDetailsCollapsed)}
            size="sm"
            variant="outline"
          >
            <Text fontWeight="normal" fontSize="xs">
              {isDetailsCollapsed ? 'Show Details' : 'Hide Details'}
            </Text>
          </Button>

          {!isDetailsCollapsed && (
            <>
              <HStack>
                <Tooltip
                  label={`The address which will be able to execute the proof, if this is set to a zero address - any relayer will be able to execute it.`}
                >
                  <QuestionOutlineIcon />
                </Tooltip>
                <Text fontSize="md">Relayer</Text>
              </HStack>
              <Text
                bg="gray.50"
                borderRadius={6}
                p={2}
                px={4}
                border="solid 1px rgba(42, 42, 42, 0.25)"
                fontWeight="bold"
                fontSize="md"
                wordBreak="break-word"
              >
                {zkProof?.solidityInput.relayer}
              </Text>
              <HStack>
                <Tooltip
                  label={`An amount to be deducted from the deposit to compensate a relayer for proof execution. The higher the fee, the greater the likelihood that the relayer will execute the proof.`}
                >
                  <QuestionOutlineIcon />
                </Tooltip>
                <Text fontSize="md">Fee</Text>
              </HStack>
              <Text
                bg="gray.50"
                borderRadius={6}
                p={2}
                px={4}
                border="solid 1px rgba(42, 42, 42, 0.25)"
                fontWeight="bold"
                fontSize="md"
              >
                {zkProof && formatUnits(zkProof.solidityInput.fee, asset?.decimals)}{' '}
                {assetSymbol}
              </Text>
              <HStack>
                <Tooltip
                  label={`Timestamp when this proof expires.`}
                >
                  <QuestionOutlineIcon />
                </Tooltip>
                <Text fontSize="md">Deadline</Text>
              </HStack>
              <Text
                bg="gray.50"
                borderRadius={6}
                p={2}
                px={4}
                border="solid 1px rgba(42, 42, 42, 0.25)"
                fontWeight="bold"
                fontSize="md"
              >
                {zkProof && zkProof.solidityInput.deadline}
              </Text>
              <HStack>
                <Tooltip label="The nullifier is calculated from the index of the commitment in the tree and the secret. The nullifier prevents double spends.">
                  <QuestionOutlineIcon />
                </Tooltip>
                <Text>Nullifier</Text>
              </HStack>
              <Text
                bg="gray.50"
                borderRadius={6}
                p={2}
                px={4}
                border="solid 1px rgba(42, 42, 42, 0.25)"
                fontWeight="bold"
                fontSize="sm"
              >
                {zkProof?.solidityInput.nullifier}
              </Text>

              <HStack w="full">
                <Tooltip label="The current merkle root of deposits that have joined the pool. Used in zero knowledge to prove that the commitment is deposited in the pool.">
                  <QuestionOutlineIcon />
                </Tooltip>
                <Text>Root</Text>
              </HStack>
              <Text
                bg="gray.50"
                borderRadius={6}
                p={2}
                px={4}
                border="solid 1px rgba(42, 42, 42, 0.25)"
                fontWeight="bold"
                fontSize="sm"
              >
                {zkProof?.solidityInput.root}
              </Text>

              <HStack w="full">
                <Tooltip label="The subset root is calculated from the subset of deposits associated with the withdrawal. Blocked deposit indexes in this list are represented by `1`, allowed deposit indexes are represented by `0`.">
                  <QuestionOutlineIcon />
                </Tooltip>
                <Text>Subset Root</Text>
              </HStack>
              <Text
                bg="gray.50"
                borderRadius={6}
                p={2}
                px={4}
                border="solid 1px rgba(42, 42, 42, 0.25)"
                fontWeight="bold"
                fontSize="sm"
              >
                {zkProof?.solidityInput.subsetRoot}
              </Text>

              <HStack>
                <Tooltip
                  label={`Subset data string compressed using Brotli algorithm.`}
                >
                  <QuestionOutlineIcon />
                </Tooltip>
                <Text fontSize="md">Compressed Subset Data</Text>
              </HStack>
              {zkProof && <Text
                bg="gray.50"
                borderRadius={6}
                p={2}
                px={4}
                border="solid 1px rgba(42, 42, 42, 0.25)"
                fontWeight="bold"
                fontSize="md"
              >
                {zkProof.metadata.subsetData}
              </Text>}
            </>
          )}
        </Stack>

        <HStack w="full" p={4} pt={2} justify="space-evenly">
          <Button
            size="lg"
            bg="black"
            color="white"
            _hover={{ bg: '#262626' }}
            onClick={() => setZkProof(null)}
          >
            <ChevronLeftIcon />
          </Button>
          {exportWithdrawData ?
            <Button
              w="full"
              size="lg"
              height="50px"
              borderRadius={10}
              colorScheme="blue"
              isDisabled={isWithdrawDisabled}
              onClick={(e) => { exportToJson(e, { pool: contractAddress, withdrawalProof }) }}
            >
              {isLoading ? <Spinner /> : 'Export withdraw data'}
            </Button> :
            account.isConnected ? (
              <Button
                w="full"
                size="lg"
                height="50px"
                borderRadius={10}
                colorScheme="blue"
                isDisabled={isWithdrawDisabled}
                onClick={() => { write?.() }}
              >
                {isLoading ? <Spinner /> : 'Withdraw'}
              </Button>
            ) : <ConnectButton />
          }
        </HStack>
      </VStack>
    </Center>
  )
}
