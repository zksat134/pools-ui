import { ChevronDownIcon, ExternalLinkIcon, QuestionOutlineIcon } from '@chakra-ui/icons';
import {
  Button,
  Container,
  Flex,
  FormControl,
  FormErrorMessage,
  Heading,
  HStack,
  VStack,
  Input,
  NumberInput,
  NumberInputField,
  Link,
  Select,
  Stack,
  Switch,
  Text,
  Tooltip,
} from '@chakra-ui/react';
import { useAtom } from 'jotai';
import { useState } from 'react';
import { usePublicClient } from 'wagmi';
import { zeroAddress } from 'viem';
import { Logo } from '../../components/Logo';
import {
  useAsset,
  useContractAddress,
  useExistingCommitments,
  useDepositsTree,
  useOptions
} from '../../hooks';
import {
  assetSymbolAtom,
  denominationAtom,
  relayerAtom,
  recipientAtom,
  feeAtom,
  spentNullifiersAtom,
  subsetRootAtom,
  deadlineAtom
} from '../../state';
import { pinchString } from '../../utils';

interface WithdrawMainContainerProps {
  isFeeInvalid: boolean;
  isRelayerInvalid: boolean;
  nullifier: string;
  exportWithdrawData: boolean;
  setExportWithdrawData: (checked: boolean) => void
}

export const WithdrawMainContainer: React.FC<WithdrawMainContainerProps> = ({
  isFeeInvalid,
  isRelayerInvalid,
  nullifier,
  exportWithdrawData,
  setExportWithdrawData,
}) => {
  const [leafIndex, setLeafIndex] = useState(NaN);
  const [relayer, setRelayer] = useAtom(relayerAtom);
  const [recipient, setRecipient] = useAtom(recipientAtom);
  const [fee, setFee] = useAtom(feeAtom);
  const [spentNullifiers] = useAtom(spentNullifiersAtom);
  const [subsetRoot] = useAtom(subsetRootAtom);
  const [assetSymbol, setAssetSymbol] = useAtom(assetSymbolAtom);
  const [denomination, setDenomination] = useAtom(denominationAtom);
  const [_, setDeadline] = useAtom(deadlineAtom);
  const { assetOptions, denominationOptions } = useOptions();
  const asset = useAsset();
  const { contractAddress } = useContractAddress();
  const { depositsTree } = useDepositsTree();
  const { existingCommitments, leafIndexToIndex } = useExistingCommitments();
  const { chain } = usePublicClient();
  const [isDetailsCollapsed, setIsDetailsCollapsed] = useState<boolean>(true);
  const [isDeadlineInvalid, setIsDeadlineInvalid] = useState<boolean>(false);
  const [deadlineInput, setDeadlineInput] = useState(0);

  const handleExportSwitch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFee('0');
    setRelayer(zeroAddress);
    setExportWithdrawData(e.target.checked);
  }

  const handleSetDeadline = (valueString: string) => {
    const inputValue = valueString.trim();
    if (inputValue === '') {
      setIsDeadlineInvalid(false);
      setDeadlineInput(0);
      setDeadline('0');
      return;
    }
    const inputNumber = parseFloat(inputValue);
    if (isNaN(inputNumber)) {
      setIsDeadlineInvalid(true);
      setDeadline('0');
      setDeadlineInput(Number(inputValue));
      return;
    }
    setIsDeadlineInvalid(false);
    if (inputNumber === 0) {
      setDeadlineInput(0);
      setDeadline('0');
    } else {
      const now = Math.floor(Date.now() / 1000);
      const deadline = inputNumber * 60 * 1000 + now;
      setDeadlineInput(Number(valueString));
      setDeadline(deadline.toString());
    }
  }

  return (
    <VStack
      bg="white"
      borderRadius={10}
      borderBottomRadius={0}
      pt={4}
      px={4}
      w="full"
    >
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
              <Tooltip label="Select an asset of the pool for withdrawal.">
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
              <Tooltip label="Select the denomination of an asset for withdrawal. Each denomination represents a separate pool, and this value includes any potential fee.">
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

      <Stack w="full" direction="column" align="flex-start">
        <HStack w="full" justify="space-between" py={2}>
          <VStack>
            <HStack>
              <Tooltip label="The same commitment can be deposited more than once. The leaf index of a commitment is how to distinguish each deposit. Each deposit can only be withdrawn once.">
                <QuestionOutlineIcon />
              </Tooltip>
              <Text>Leaf Index</Text>
            </HStack>
            <Select
              w="fit-content"
              textAlign="center"
              size="sm"
              bg="gray.50"
              onChange={(e) => setLeafIndex(Number(e.target.value))}
              defaultValue={leafIndex.toString()}
            >
              {existingCommitments.map((commitmentData, i) => (
                <option
                  value={commitmentData.leafIndex.toString()}
                  key={`${commitmentData.leafIndex.toString()}-${i}-option`}
                  disabled={Boolean(
                    spentNullifiers[existingCommitments[i]?.nullifier]
                  )}
                >
                  {commitmentData.leafIndex.toString()}
                </option>
              ))}
            </Select>
          </VStack>
          <VStack>
            <HStack>
              <Tooltip label="The nullifier is calculated from the index of the commitment in the tree and the secret. The nullifier prevents double spends.">
                <QuestionOutlineIcon />
              </Tooltip>
              <Text fontSize="md">Nullifier</Text>
            </HStack>
            <Tooltip label={nullifier}>
              <Text
                fontSize="lg"
                fontWeight="bold"
                _hover={{
                  color: 'gray.500'
                }}
                color={
                  Boolean(
                    spentNullifiers[
                    existingCommitments[leafIndexToIndex[leafIndex]]
                      ?.nullifier
                    ]
                  )
                    ? 'red'
                    : ''
                }
              >
                {pinchString(`${nullifier}`, 6)}
              </Text>
            </Tooltip>
          </VStack>
        </HStack>
      </Stack>
      <VStack w="full">
        <HStack w="full" alignItems='center' mt="10px" mb="10px">
          <Tooltip label="Switch between executing the withdrawal directly within the app or exporting withdrawal call data for external relayers.">
            <QuestionOutlineIcon />
          </Tooltip>
          <Text>Export withdraw data</Text>
          <Switch
            isChecked={exportWithdrawData}
            size='lg'
            onChange={(event) => { handleExportSwitch(event) }}
          />
        </HStack>
      </VStack>
      <HStack w="full">
        <Tooltip label="Recipient will receive the funds from the withdrawal. Use a *brand new* Ethereum address for every withdrawal.">
          <QuestionOutlineIcon />
        </Tooltip>
        <Text fontSize="md">Recipient</Text>
      </HStack>
      <Input
        bg="gray.50"
        type="text"
        size="md"
        name="recipient"
        placeholder="(You)"
        border="solid 1px rgba(200, 200, 200, 0.25)"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
      />
      <Button
        onClick={() => setIsDetailsCollapsed(!isDetailsCollapsed)}
        size="sm"
        variant="outline"
        w="full"
      >
        <Text fontWeight="normal" fontSize="xs">
          {isDetailsCollapsed ? 'Show Details' : 'Hide Details'}
        </Text>
      </Button>
      {!isDetailsCollapsed && (
        <>
          {exportWithdrawData &&
            <>
              <FormControl
                w="full"
                isRequired
                isInvalid={isRelayerInvalid}
              >
                <VStack w="full">
                  <HStack w="full">
                    <Tooltip label="The address which will be able to execute the proof, if this is set to a zero address - any relayer will be able to execute it.">
                      <QuestionOutlineIcon />
                    </Tooltip>
                    <Text>Relayer</Text>
                  </HStack>
                  <Input
                    bg="gray.50"
                    type="text"
                    name="relayer"
                    placeholder="0x00...dead"
                    value={relayer}
                    onChange={(e) => setRelayer(e.target.value)}
                  />
                </VStack>
                <HStack align="center" justify="center">
                  <FormErrorMessage pb={4}>
                    Invalid relayer address.
                  </FormErrorMessage>
                </HStack>
              </FormControl>
              <FormControl w="full" isRequired isInvalid={isFeeInvalid}>
                <VStack align="center">
                  <HStack w="full">
                    <Tooltip label="An amount deducted from the deposit to compensate a relayer for proof execution. It can be any decimal value that does not exceed the deposit amount, and the number of decimals must not exceed the asset's decimal precision. The higher the fee, the greater the likelihood that the relayer will execute the proof.">
                      <QuestionOutlineIcon />
                    </Tooltip>
                    <Text>Fee</Text>
                  </HStack>
                  <Input
                    bg="gray.50"
                    type="text"
                    name="fee"
                    placeholder="0.00"
                    value={fee}
                    onChange={(e) => setFee(e.target.value)}
                  />
                </VStack>
                <HStack align="center" justify="center">
                  <FormErrorMessage pb={4} px={4}>
                    Invalid fee amount. Must be less than the note
                    denomination and have at most 18 decimals.
                  </FormErrorMessage>
                </HStack>
              </FormControl>
              <FormControl w="full" isRequired isInvalid={isDeadlineInvalid}>
                <VStack align="center">
                  <HStack w="full">
                    <Tooltip label="This value represents the duration in minutes from the current time until the proof's expiration. Setting this value to 0 ensures that the proof will not expire.">
                      <QuestionOutlineIcon />
                    </Tooltip>
                    <Text>Deadline</Text>
                  </HStack>
                  <NumberInput
                    w="100%"
                    bg="gray.50"
                    inputMode="numeric"
                    name="deadline"
                    value={deadlineInput}
                    onChange={(value) => handleSetDeadline(value)}
                  >
                    <NumberInputField />
                  </NumberInput>
                </VStack>
                <HStack align="center" justify="center">
                  <FormErrorMessage pb={4} px={4}>
                    Invalid deadline.
                  </FormErrorMessage>
                </HStack>
              </FormControl>
            </>
          }
          <FormControl w="full" isRequired>
            <VStack align="center">
              <HStack w="full">
                <Tooltip label="The current merkle root of deposits that have joined the pool. Used in zero knowledge to prove that the commitment is deposited in the pool.">
                  <QuestionOutlineIcon />
                </Tooltip>
                <Text>Root</Text>
              </HStack>
              <Input
                bg="gray.50"
                readOnly
                type="text"
                name="root"
                placeholder="root (required)"
                value={chain ? depositsTree[chain.id][contractAddress]?.root.toHexString() : ''}
              />
            </VStack>
          </FormControl>
          <FormControl w="full" isRequired>
            <VStack align="center">
              <HStack w="full">
                <Tooltip label="The subset root is calculated from the subset of deposits associated with the withdrawal. Blocked deposit indexes in this list are represented by `1`, allowed deposit indexes are represented by `0`. Click `Subset Maker` to customize your subset.">
                  <QuestionOutlineIcon />
                </Tooltip>
                <Text>Subset Root</Text>
              </HStack>
              <Input
                bg="gray.50"
                readOnly
                type="text"
                name="subsetRoot"
                placeholder="subsetRoot (required)"
                value={subsetRoot?.toHexString()}
              />
            </VStack>
          </FormControl>
        </>
      )}
    </VStack>
  )
}
