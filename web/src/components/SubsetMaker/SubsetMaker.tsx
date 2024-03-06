import { ExternalLinkIcon, QuestionOutlineIcon, SearchIcon } from '@chakra-ui/icons';
import {
  Button, Box, Center, Checkbox, Container, Flex, Heading, HStack, InputGroup, InputLeftElement, Input, Link,
  Table, TableContainer, Tabs, Tab, TabList, Tbody, Td, Text, Th, Thead, Tooltip, Tr, Spinner,
} from '@chakra-ui/react';
import { useAtom } from 'jotai';
import _ from 'lodash';
import { AccessList, SubsetData } from 'pools-ts';
import React, { useEffect, useState } from 'react';
import { useNetwork } from 'wagmi';
import { useAccessList, useNote } from '../../hooks';
import { commitmentsAtom } from '../../state';
import { ClickToCopy } from '../ClickToCopy';
import { growShrinkProps, pinchString } from '../../utils';

function SubsetMaker() {
  const { accessList, setAccessList, initializeAccessList, loading } = useAccessList();
  const { chain } = useNetwork();
  const { commitment } = useNote();
  const [commitments] = useAtom(commitmentsAtom);
  const [subsetData, setSubsetData] = useState<SubsetData>([]);
  const [currentTab, setCurrentTab] = useState<number>(0);
  const [allCurrentPage, setAllCurrentPage] = useState<number>(1);
  const [allTotalPages, setAllTotalPages] = useState<number>(1);
  const [selectedCurrentPage, setSelectedCurrentPage] = useState<number>(1);
  const [selectedTotalPages, setSelectedTotalPages] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const pageSize = 20;

  const filteredCommitments = commitments.filter(commitmentData =>
    commitmentData.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
    commitmentData.commitment.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // initialize subsetData
  useEffect(() => {
    if (!loading && subsetData.length === 0 && accessList.length > 0) {
      setSubsetData(accessList.getWindow(0, accessList.length));
    }
  }, [loading, subsetData.length, accessList.length]);

  // update total pages for all deposits tab
  useEffect(() => {
    const newAllTotalPages = Math.ceil(commitments.length / pageSize);
    setAllTotalPages(newAllTotalPages);
  }, [commitments, pageSize]);

  // update total pages for selected deposits tab
  useEffect(() => {
    const newSelectedTotalPages = Math.ceil(filteredCommitments.filter((_, index) => subsetData[index] === 1).length / pageSize);
    setSelectedTotalPages(newSelectedTotalPages);
  }, [subsetData, pageSize, filteredCommitments]);

  const handleCheck = (index: number) => {
    const updatedData = [...subsetData];
    updatedData[index] = updatedData[index] === 1 ? 0 : 1;
    setSubsetData(updatedData);
  };

  // render commitments based on current page and tab
  const renderCommitments = (
    currentPage: number,
    tab: number,
    prevPage: () => void,
    nextPage: () => void,
    firstPage: () => void,
    lastPage: () => void,
    totalPages: number
  ) => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    let currentCommitments = tab === 1
      ? filteredCommitments.filter((_, index) => subsetData[commitments.indexOf(filteredCommitments[index])] === 1)
      : filteredCommitments;

    currentCommitments = currentCommitments.slice().reverse();
    const slicedCommitments = currentCommitments.slice(startIndex, endIndex);

    return (
      <TableContainer overflowY="auto" width="100%">
        <Table variant="simple" size="sm">
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
            {slicedCommitments.map((commitmentData, i) => {
              const originalIndex = commitments.indexOf(commitmentData);
              return (
                <Tr key={commitmentData.leafIndex}>
                  <Td>
                    <Checkbox
                      pr={2}
                      colorScheme="red"
                      id={commitmentData.leafIndex.toString()}
                      isDisabled={loading || commitment.eq(commitmentData.commitment)}
                      isChecked={subsetData[originalIndex] === 1}
                      onChange={() => handleCheck(originalIndex)}
                    />
                    {commitmentData.leafIndex}
                    {commitment.eq(commitmentData.commitment) &&
                      <Tooltip label="Can't block your own commitment.">
                        <QuestionOutlineIcon ml={2}/>
                      </Tooltip>
                    }
                  </Td>
                  <Td>
                    <HStack>
                      <ClickToCopy value={commitmentData.sender} />
                      <Link
                        w="full"
                        href={`${chain?.blockExplorers?.default.url}/address/${commitmentData.sender}`}
                        isExternal
                      >
                        <Text
                          key={`sender-${commitmentData.leafIndex}`}
                          color="blue.700"
                          fontSize="sm"
                          textAlign="left"
                          wordBreak="break-all"
                          {...growShrinkProps}
                        >
                          {pinchString(commitmentData.sender.toString(), 12)}{' '}
                          <ExternalLinkIcon />
                        </Text>
                      </Link>
                    </HStack>
                  </Td>
                  <Td>
                    <HStack>
                      <ClickToCopy value={commitmentData.commitment} />
                      <Text wordBreak="break-all">
                        {pinchString(commitmentData.commitment, 16)}
                      </Text>
                    </HStack>
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
        <Box px={2} mt={4}>
          <Center>
            <Button mr={1} size="sm" onClick={() => firstPage()}>
              First
            </Button>
            <Button size="sm" disabled={currentPage === 1} onClick={() => prevPage()}>
              Previous
            </Button>
            <Text as="span" ml={2} mr={2}>
              Page {currentPage} of {totalPages}
            </Text>
            <Button mr={1} size="sm" disabled={currentPage === totalPages} onClick={() => nextPage()}>
              Next
            </Button>
            <Button size="sm" onClick={() => lastPage()}>
              Last
            </Button>
          </Center>
        </Box>
      </TableContainer>
    );
  };

  const allPrevPage = () => {
    const prevPage = allCurrentPage - 1;
    if (prevPage >= 1) {
      setAllCurrentPage(prevPage);
    }
  };

  const allNextPage = () => {
    const nextPage = allCurrentPage + 1;
    if (nextPage <= allTotalPages) {
      setAllCurrentPage(nextPage);
    }
  };

  const selectedPrevPage = () => {
    const prevPage = selectedCurrentPage - 1;
    if (prevPage >= 1) {
      setSelectedCurrentPage(prevPage);
    }
  };

  const selectedNextPage = () => {
    const nextPage = selectedCurrentPage + 1;
    if (nextPage <= selectedTotalPages) {
      setSelectedCurrentPage(nextPage);
    }
  };

  const allFirstPage = () => {
    setAllCurrentPage(1);
  };

  const allLastPage = () => {
    setAllCurrentPage(allTotalPages);
  };

  const selectedFirstPage = () => {
    setSelectedCurrentPage(1);
  };

  const selectedLastPage = () => {
    setSelectedCurrentPage(selectedTotalPages);
  };

  const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    setAllCurrentPage(1);
    setSelectedCurrentPage(1);

    const filteredCommitments = commitments.filter(commitmentData =>
      commitmentData.sender.toLowerCase().includes(query) ||
      commitmentData.commitment.toLowerCase().includes(query)
    );

    const newAllTotalPages = Math.ceil(filteredCommitments.length / pageSize);
    setAllTotalPages(newAllTotalPages);

    const filteredSubsetCommitments = filteredCommitments.filter((_, index) => subsetData[index] === 1);

    const newSelectedTotalPages = Math.ceil(filteredSubsetCommitments.length / pageSize);
    setSelectedTotalPages(newSelectedTotalPages);
  };

  const updateAccessList = () => {
    const start: number = 0;
    const end: number = accessList.length;

    if (!_.isEqual(accessList.getWindow(start, end), subsetData)) {
      const updatedAccessList = AccessList.fromJSON(accessList.toJSON());
      updatedAccessList.setWindow(start, end, subsetData);
      setAccessList(updatedAccessList);
    }
  };

  const handleReset = () => {
    setSubsetData([]);
    initializeAccessList();
  }

  const updateRequired = _!.isEqual(
    subsetData,
    accessList.getWindow(
      0,
      accessList.length
    )
  );

  return (
    <Container centerContent minW="216px" maxW="960px">
      <Container position="sticky" bg="blue.50" borderRadius={8} p={3} mt={2} mb={2}>
        <Center>
          <HStack pb={1}>
            <Tooltip label="Select deposits to be excluded. Exclude any deposits by optionally selecting the checkbox. All addresses from your custom blocklist in settings menu will be pre-selected here.">
              <QuestionOutlineIcon />
            </Tooltip>
            <Heading size="sm">Subset Root</Heading>
          </HStack>
        </Center>
        <Text
          fontSize="xs"
          color="blue.800"
          fontWeight="bold"
          textAlign="center"
        >
          {accessList?.root.toHexString()}
        </Text>
        <HStack justify="center" mt={2}>
          <Button
            size="xs"
            colorScheme="blue"
            onClick={updateAccessList}
            isDisabled={loading || updateRequired}
          >
            Update access list
          </Button>
          <Button
            size="xs"
            colorScheme="blue"
            onClick={handleReset}
            isDisabled={loading}
          >
            <Flex align="center">
              Reset to default {loading ? <Spinner size="xs" color="white" ml={1} /> : null}
            </Flex>
          </Button>
        </HStack>
      </Container>
      <Box w="full" py={2}>
        <Flex align="center" justify="space-between">
          <Tabs size="sm" variant="soft-rounded" colorScheme="blue" onChange={(tabIndex) => setCurrentTab(tabIndex)}>
            <TabList>
              <Tab>All Deposits</Tab>
              <Tab>Selected Deposits</Tab>
            </TabList>
          </Tabs>
          <InputGroup minW="300px" maxW="480px">
            <InputLeftElement pointerEvents="none">
              <SearchIcon />
            </InputLeftElement>
            <Input
              textAlign="right"
              borderRadius="5px"
              h="40px"
              size='xs'
              type="text"
              placeholder="Search for address or commitment"
              value={searchQuery}
              onChange={handleSearchInputChange}
            />
          </InputGroup>
        </Flex>
      </Box>
      {currentTab === 0 && renderCommitments(
        allCurrentPage,
        0,
        allPrevPage,
        allNextPage,
        allFirstPage,
        allLastPage,
        allTotalPages
      )}
      {currentTab === 1 && renderCommitments(
        selectedCurrentPage,
        1,
        selectedPrevPage,
        selectedNextPage,
        selectedFirstPage,
        selectedLastPage,
        selectedTotalPages
      )}
    </Container>
  );
}

export default React.memo(SubsetMaker);
