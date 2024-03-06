import { useState } from 'react';
import { BigNumber } from 'ethers';
import {
  ExternalLinkIcon,
  NotAllowedIcon,
  CheckCircleIcon,
  RepeatIcon
} from '@chakra-ui/icons';
import {
  Button,
  Center,
  Container,
  Heading,
  HStack,
  Link,
  Stack,
  Text,
  TableContainer,
  Table,
  TableCaption,
  Thead,
  Th,
  Tr,
  Tbody,
  Tfoot,
  Td,
  VStack,
} from '@chakra-ui/react';
import { useNetwork } from 'wagmi';
import { useCommitments } from '../../hooks';
import { Commitment } from '../../state';
import { growShrinkProps, pinchString } from '../../utils';

interface DepositsTableProps {
  commitment: BigNumber;
  contractAddress: string;
  existingCommitments: (Commitment & {
    nullifier: string;
  })[];
  nullifier: string;
  spentNullifiers: Record<string, boolean>;
}

export const DepositsTable: React.FC<DepositsTableProps> = ({
  commitment,
  contractAddress,
  existingCommitments,
  nullifier,
  spentNullifiers,
}) => {
  const { chain } = useNetwork();
  const { executeCommitmentsQuery } = useCommitments();
  const [isDepositsCollapsed, setIsDepositsCollapsed] = useState<boolean>(true);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const numSpentDeposits = existingCommitments.filter(
    ({ nullifier }) => spentNullifiers[nullifier]
  ).length;

  return (
    <Container centerContent minW="216px" maxW="960px" mb={40} px={0}>
      <Stack
        direction="row"
        justify="space-between"
        align="center"
        mt={4}
        p={4}
        w="full"
        bg="gray.100"
        border="solid 1px #BEE3F8"
        borderBottom="none"
        borderRadius="8px 8px 0 0"
      >
        <Heading color="gray.700" size="sm">
          Your Deposits
        </Heading>
        {numSpentDeposits > 0 ? (
          <HStack>
            <Text
              fontWeight="bold"
              color="gray.700"
              fontSize="sm"
              p={1}
              borderRadius={8}
            >
              Claimable: {existingCommitments.length - numSpentDeposits}
            </Text>
            <Text
              fontWeight="bold"
              color="gray.700"
              fontSize="sm"
              p={1}
              borderRadius={8}
            >
              Total: {existingCommitments?.length}
            </Text>
            <Button
              onClick={() => {
                setIsFetching(true);
                executeCommitmentsQuery();
                setTimeout(() => setIsFetching(false), 15000);
              }}
              isDisabled={isFetching}
              p={0}
            >
              <RepeatIcon />
            </Button>
          </HStack>
        ) : (
          <HStack>
            <Text
              fontWeight="bold"
              color="gray.700"
              fontSize="sm"
              p={1}
              borderRadius={8}
            >
              Claimable: {existingCommitments?.length}
            </Text>
            <Text
              fontWeight="bold"
              color="blue.700"
              fontSize="sm"
              bg="gray.100"
              p={1}
              borderRadius={8}
            >
              Total: {existingCommitments?.length}
            </Text>
          </HStack>
        )}
      </Stack>
      <Stack
        w="full"
        bg="gray.50"
        border="solid 1px #BEE3F8"
        borderTop="none"
        borderRadius="0 0 8px 8px"
        p={1}
      >
        {BigNumber.from(nullifier).eq(0) ? (
          <Stack>
            <Center h="100%" p={4}>
              <Text
                color="blue.900"
                fontWeight="bold"
                whiteSpace="pre-wrap"
                textAlign="center"
              >
                {!commitment.eq(0)
                  ? 'No deposits detected for this commitment.\nRecent deposits may take some time to appear.'
                  : 'Unlock your note wallet.'}
              </Text>
            </Center>
          </Stack>
        ) : (
          <>
            <Stack align="center" py={2} px={2}>
              <Button
                w="full"
                size="sm"
                variant="outline"
                onClick={() =>
                  setIsDepositsCollapsed(!isDepositsCollapsed)
                }
              >
                <Text fontWeight="normal" fontSize="xs">
                  {isDepositsCollapsed
                    ? 'Show Deposits'
                    : 'Hide Deposits'}
                </Text>
              </Button>
            </Stack>
            {!isDepositsCollapsed && (
              <>
                <Center>
                  <VStack align="flex-start" px={4} w="80%">
                    <Text
                      color="blue.600"
                      borderRadius={8}
                      fontWeight="bold"
                      fontSize="xs"
                    >
                      COMMITMENT
                    </Text>
                    <Text
                      color="blue.900"
                      fontWeight="normal"
                      wordBreak="break-word"
                    >
                      {pinchString(commitment.toHexString(), [8, 16])}
                    </Text>
                  </VStack>
                </Center>
                <TableContainer
                  whiteSpace="unset"
                  maxH="98vh"
                  overflowY="auto"
                  p={2}
                  w="full"
                >
                  <Table variant="simple" size="md" colorScheme="blue">
                    <TableCaption>
                      Your Spent and Unspent Notes in {contractAddress}
                    </TableCaption>
                    <Thead>
                      <Tr w="100%">
                        <Th w="6.25%">
                          <Text color="blue.600">#</Text>
                        </Th>
                        <Th w="6.25%">
                          <Text color="blue.600">Claimable</Text>
                        </Th>
                        <Th w="21.5%">
                          <HStack>
                            <Text color="blue.600">Sender</Text>
                            <Text
                              color="green.700"
                              bg="teal.100"
                              borderRadius={8}
                              p={1}
                            >
                              address
                            </Text>
                          </HStack>
                        </Th>
                        <Th w="33%">
                          <HStack>
                            <Text color="blue.600">Nullifier</Text>
                            <Text
                              color="purple.700"
                              bg="blue.100"
                              borderRadius={8}
                              p={1}
                            >
                              bytes32
                            </Text>
                          </HStack>
                        </Th>
                      </Tr>
                    </Thead>

                    <Tbody>
                      {existingCommitments.length > 0 &&
                        existingCommitments.map(
                          ({ leafIndex, sender, nullifier }, i) => (
                            <Tr key={`row-${leafIndex}`} w="full">
                              <Td w="6.25%">
                                <Text color="blue.900">{leafIndex}</Text>
                              </Td>
                              <Td w="6.25%">
                                {!Boolean(spentNullifiers[nullifier]) ? (
                                  <CheckCircleIcon color="green.400" />
                                ) : (
                                  <NotAllowedIcon color="red.400" />
                                )}
                              </Td>
                              <Td w="21.5%" wordBreak="break-all">
                                <Container p={0}>
                                  <Link
                                    w="full"
                                    {...growShrinkProps}
                                    href={`${chain?.blockExplorers?.default.url}/address/${sender}`}
                                    isExternal
                                  >
                                    <Text
                                      key={`sender-${leafIndex}`}
                                      color="blue.700"
                                      fontSize="sm"
                                      textAlign="left"
                                      {...growShrinkProps}
                                    >
                                      {pinchString(
                                        sender.toString(),
                                        [4, 6]
                                      )}{' '}
                                      <ExternalLinkIcon />
                                    </Text>
                                  </Link>
                                </Container>
                              </Td>
                              <Td w="33%" wordBreak="break-all">
                                <Text color="blue.900">
                                  {pinchString(nullifier, [8, 16])}
                                </Text>
                              </Td>
                            </Tr>
                          )
                        )}
                    </Tbody>

                    <Tfoot>
                      <Tr w="100%">
                        <Th w="6.25%">
                          <Text color="blue.600">#</Text>
                        </Th>
                        <Th w="6.25%">
                          <Text color="blue.600">Claimable</Text>
                        </Th>
                        <Th w="21.5%">
                          <HStack>
                            <Text color="blue.600">Sender</Text>
                            <Text
                              color="green.700"
                              bg="teal.100"
                              borderRadius={8}
                              p={1}
                            >
                              address
                            </Text>
                          </HStack>
                        </Th>
                        <Th w="33%">
                          <HStack>
                            <Text color="blue.600">Nullifier</Text>
                            <Text
                              color="purple.700"
                              bg="blue.100"
                              borderRadius={8}
                              p={1}
                            >
                              bytes32
                            </Text>
                          </HStack>
                        </Th>
                      </Tr>
                    </Tfoot>
                  </Table>
                </TableContainer>
              </>
            )}
          </>
        )}
      </Stack>
    </Container>
  )
}
