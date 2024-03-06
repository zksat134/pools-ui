import {
  Box,
  Flex,
  Text,
} from '@chakra-ui/react';
import { AiOutlineCopyright } from 'react-icons/ai';

export function DappFooter() {
  const year = new Date().getFullYear();
  return (
    <Box
      as="footer"
      position="fixed"
      bottom="0"
      py={2}
      zIndex="10"
      mt={20}
      textAlign="center"
      w="100%"
      bg="rgb(23,25,35)"
      bgGradient="linear-gradient(0deg, rgba(23,25,35,1) 54%, rgba(45,55,72,1) 97%)"
      color="gray.400"
    >
      <Flex direction="column" alignItems="center">
        <Flex alignItems="center">
          <AiOutlineCopyright />
          <Text fontSize="sm" mr={1}>
            Privacy Pools,
          </Text>
          <Text fontSize="sm">{year}</Text>
        </Flex>
      </Flex>
    </Box>
  );
}

export default DappFooter;
