import { Menu, MenuButton, MenuItem, MenuList, Flex, Box, Link, IconButton, useDisclosure } from '@chakra-ui/react';
import { FaSwimmingPool } from 'react-icons/fa';
import { HamburgerIcon } from '@chakra-ui/icons';
import { Link as HashLink } from 'react-router-dom';

const NavBar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Flex
      alignItems="center"
      justifyContent="space-between"
      position="sticky"
      top={0}
      zIndex={10}
      py={5}
      backdropFilter="auto"
      backdropBlur="8px"
      filter="auto"
    >
      <Box _hover={{ textDecoration: 'none' }}>
        <HashLink to="/">
          <Flex align="center">
            <Box as={FaSwimmingPool} boxSize={8} mr={4} />
            <Box as="h1" fontSize="2xl" fontWeight="bold" flex="1">
              PRIVACY POOLS
            </Box>
          </Flex>
        </HashLink>
      </Box>
      <Box display={{ base: 'none', lg: 'block' }}>
        <Menu>
          <MenuButton as={Box} fontWeight="bold" mr={4} display="inline" cursor="pointer">
            github
          </MenuButton>
          <MenuList>
            <MenuItem as='a' fontWeight="bold" fontSize="sm" href="https://github.com/0x132fabb5bc2fb61fc68bcfb5508841ddb11e9/pools-sol" target="_blank">
              contracts
            </MenuItem>
            <MenuItem as='a' fontWeight="bold" fontSize="sm" href="https://github.com/zksat134/pools-ui" target="_blank">
              frontend
            </MenuItem>
          </MenuList>
        </Menu>
        <Box fontWeight="bold" mr={4} display="inline">
          <HashLink to="/explorer">
            explorer
          </HashLink>
        </Box>
        <Box fontWeight="bold" mr={4} display="inline">
          <HashLink to="/deposit">
            dapp
          </HashLink>
        </Box>
      </Box>
      <IconButton
        aria-label="Navigation menu"
        icon={<HamburgerIcon />}
        size="xl"
        fontWeight="bold"
        variant="ghost"
        p={3}
        borderRadius="full"
        display={{ base: 'block', lg: 'none' }}
        onClick={isOpen ? onClose : onOpen}
      />
      {isOpen && (
        <Box
          bg="white"
          position="absolute"
          top="60px"
          right="0"
          py={2}
          px={4}
          display={{ base: 'block', lg: 'none' }}
        >
          <Link
            mr={4}
            display="block"
            mb={2}
            fontWeight="bold"
            target="_blank"
            href="https://github.com/zksat134/pools-ui"
          >
            github
          </Link>
          <Box
            mr={4}
            display="block"
            mb={2}
            fontWeight="bold"
          >
            <HashLink to="/explorer">
              explorer
            </HashLink>
          </Box>
          <Box
            mr={4}
            display="block"
            mb={2}
            fontWeight="bold"
          >
            <HashLink to="/deposit">
              dapp
            </HashLink>
          </Box>
        </Box>
      )}
    </Flex>
  );
};

export default NavBar;
