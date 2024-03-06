import {
  Box,
  Heading,
  Text,
  Flex,
  Divider,
  Link,
} from '@chakra-ui/react';
import { AiOutlineCopyright } from 'react-icons/ai';

const Footer: React.FC = () => {
  const year = new Date().getFullYear();
  return (
    <Box>
      <Box
        pt="5rem"
        display="flex"
        flexDirection="column"
        textAlign="center"
        justifyContent="center"
        alignItems="center"
        bg="rgb(23,25,35)"
        bgGradient="linear-gradient(0deg, rgba(23,25,35,1) 54%, rgba(45,55,72,1) 97%)"
        color="white"
      >
        <Box width={{ base: '80%', md: '40%' }} mb={20}>
          <Box
            bg="black"
            color="gray.200"
            border="3px solid gray"
            borderRadius={20}
            px={8}
            py={10}
          >
            <Text textAlign="left">
              &quot;The best known cryptographic problem is that of privacy:
              preventing the unauthorized extraction of information from
              communications over an insecure channel.&quot;
            </Text>

            <Text fontWeight="bold" textAlign="right" mt={4}>
              - Diffie and Hellman, &quot;New Directions in Cryptography&quot;
              1976
            </Text>
          </Box>
        </Box>
        <Heading as="h1" size="2xl" mb="1rem" mt={2} px={5}>
          Built from the ground up. Built on Ethereum.
        </Heading>
      </Box>
      <Box
        as="footer"
        mt="auto"
        pb={10}
        textAlign="center"
        w="100%"
        bg="gray.900"
        color="gray.400"
      >
        <Flex direction="column" alignItems="center">
          <Divider
            orientation="horizontal"
            h="1px"
            w="60%"
            bg="gray.500"
            my={5}
          />
          <Text fontSize="m" color="gray.500" mt={2}>
            Forked from{' '}
            <Link href="https://github.com/ameensol" target="_blank" rel="noopener noreferrer" textDecoration="underline">
              @ameensol's
            </Link>
            {' '}
            <Link href="https://github.com/ameensol/pools-ui" target="_blank" rel="noopener noreferrer" textDecoration="underline">
              pools-ui
            </Link>
            {' '}
            project
          </Text>

          <Text fontSize="m" color="gray.500" mt={2}>
            Original contracts and{' '}
            <Link href="https://github.com/ameensol/privacy-pools" target="_blank" rel="noopener noreferrer" textDecoration="underline">
              docs
            </Link>
          </Text>
          <Flex alignItems="center">
            <AiOutlineCopyright />
            <Text fontSize="lg" ml={1}>
              Privacy Pools,
            </Text>
            <Text fontSize="lg">{year}</Text>
          </Flex>
          <Flex alignItems="center" mt={2}>
            <Text fontSize="xs" color="gray.500" mr={2}>
              ALL RIGHTS RESERVED
            </Text>
          </Flex>
        </Flex>
      </Box>
    </Box>
  );
};

export default Footer;
