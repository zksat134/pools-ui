import { ExternalLinkIcon } from '@chakra-ui/icons';
import {
  Button,
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
  Tr,
  Th,
  Tbody,
  Td,
  Tfoot,
} from '@chakra-ui/react';
import { hexZeroPad } from 'ethers/lib/utils';
import { useState } from 'react'
import { useNetwork } from 'wagmi';
import { useCommitments, useContractAddress } from '../../hooks';
import { growShrinkProps, pinchString } from '../../utils';

export function DepositsTable() {
  const [isDepositsCollapsed, setIsDepositsCollapsed] = useState<boolean>(true);
  const { chain } = useNetwork();
  const { contractAddress } = useContractAddress();
  const { commitments } = useCommitments();

  return (
    <Container centerContent minW="216px" maxW="960px">
      <Stack
        w="full"
        direction="row"
        justify="space-between"
        align="center"
        position="sticky"
        zIndex="2"
        top={0}
        bg="gray.300"
        mt={4}
        p={4}
        border="solid 1px #BEE3F8"
        borderBottom="none"
        borderRadius="8px 8px 0 0"
      >
        <Heading color="black" size="sm">
          Deposits
        </Heading>

        <Text fontWeight="bold" color="black" fontSize="sm">
          Total: {commitments?.length}
        </Text>
      </Stack>

      <Stack
        w="full"
        bg="gray.50"
        border="solid 1px #BEE3F8"
        borderTop="none"
        borderRadius="0 0 8px 8px"
      >
        <Stack align="center" py={2} px={2}>
          <Button
            w="full"
            size="sm"
            variant="outline"
            onClick={() => setIsDepositsCollapsed(!isDepositsCollapsed)}
          >
            Show Deposits
          </Button>
        </Stack>

        {!isDepositsCollapsed && (
          <TableContainer
            whiteSpace="unset"
            maxH="42vh"
            overflowY="auto"
            p={2}
            w="full"
          >
            <Table variant="simple" size="md" colorScheme="blue">
              <TableCaption>
                Deposits list for {contractAddress}
              </TableCaption>
              <Thead>
                <Tr>
                  <Th>
                    <Text color="blue.600">#</Text>
                  </Th>
                  <Th>
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
                  <Th>
                    <HStack>
                      <Text color="blue.600">Commitment</Text>
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
                {commitments
                  .slice(
                    commitments.length < 30 ? 0 : commitments.length - 30
                  )
                  .map(({ commitment, leafIndex, sender }) => (
                    <Tr key={`commitments-row-${leafIndex}`}>
                      <Td>{leafIndex}</Td>
                      <Td>
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
                            wordBreak="break-all"
                            {...growShrinkProps}
                          >
                            {pinchString(sender.toString(), 12)}{' '}
                            <ExternalLinkIcon />
                          </Text>
                        </Link>
                      </Td>
                      <Td>
                        <Text wordBreak="break-all">
                          {pinchString(hexZeroPad(commitment, 32), 16)}
                        </Text>
                      </Td>
                    </Tr>
                  ))}
              </Tbody>

              <Tfoot>
                <Tr>
                  <Th>
                    <Text color="blue.600">#</Text>
                  </Th>
                  <Th>
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
                  <Th>
                    <HStack>
                      <Text color="blue.600">Commitment</Text>
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
        )}
      </Stack>
    </Container>
  )
}
