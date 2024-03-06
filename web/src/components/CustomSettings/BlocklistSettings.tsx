import { Button, Textarea, Flex } from '@chakra-ui/react';
import { ethers } from "ethers";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { useAccessList } from '../../hooks';
import { blockedAddressesAtom } from "../../state";

export default function CustomRPCSettings(): JSX.Element {
  const { setNeedsSync } = useAccessList();
  const [blockedAddresses, setBlockedAddresses] = useAtom(blockedAddressesAtom);
  const [blockedAddressInput, setBlockedAddessInput] = useState('');

  const onHandleSave = async () => {
    let list = blockedAddressInput;
    if (blockedAddressInput.startsWith('http://') || blockedAddressInput.startsWith('https://')) {
      try {
        const response = await fetch(blockedAddressInput);
        const jsonData = await response.json();
        list = jsonData.join(',');
      } catch (error) {
        console.error('Error fetching blocklist:', error);
      }
    }
    const addresses = list.split(',').map(address => address.trim());
    const validAddresses = addresses.filter(address => {
      if (ethers.utils.isAddress(address)) {
        return true;
      }
      return false;
    }).map(address => ethers.utils.getAddress(address));
    const validAddressesString = validAddresses.join(',');
    setBlockedAddessInput(validAddressesString);
    setBlockedAddresses(validAddressesString);
    localStorage.setItem('privacy-pools-blocklist', validAddressesString);
    setNeedsSync(true);
  }

  useEffect(() => {
    setBlockedAddessInput(blockedAddresses || '');
  }, [])

  return (
    <>
      <Flex direction="column" pb={6}>
        <Flex>
          <Textarea
            value={blockedAddressInput}
            onChange={(e) => setBlockedAddessInput(e.target.value)}
            placeholder="Enter a URL pointing to a JSON file containing a list of addresses you wish to exclude from your subsets. Alternatively, you can manually enter addresses, separating each one with a comma."
            focusBorderColor="gray.400"
            bg="gray.50"
            size={{ base: 'xs', md: 'md' }}
            fontFamily="monospace"
            fontWeight="normal"
            minH="300px"
          />
        </Flex>
      </Flex>

      <Flex
        w="100%"
        justify="center"
        align="center"
        direction={{ base: 'column', md: 'row' }}
      >
        <Button
          w="100%"
          colorScheme="blue"
          onClick={onHandleSave}
          borderRadius={10}
        >
          Save
        </Button>
      </Flex>
    </>
  )
}
