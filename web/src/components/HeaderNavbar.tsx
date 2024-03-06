import {
  Box,
  BoxProps,
  Container,
  Flex,
  HStack,
} from '@chakra-ui/react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Link as HashLink, useLocation, useNavigate } from 'react-router-dom';
import React from 'react';
import { FaSwimmingPool } from 'react-icons/fa';
import { NoteWalletConnectButton } from './NoteWallet';
import styled from 'styled-components';
import CustomSettings from './CustomSettings';

interface HeaderNavbarProps extends BoxProps {
  title?: string;
}

const Wrapper = styled.div`
  user-select: none;
  .mobile-only {
    display: none;

    @media (max-width: 650px) {
      display: inline;
      min-width: 95vw;
    }
  }
  .desktop-only {
    display: flex;

    @media (max-width: 650px) {
      display: none;
    }
  }

  .dapp-navigation {
    background: black;
    background-image: linear-gradient(0deg, rgb(23, 25, 35) 54%, rgb(45, 55, 72) 97%);
    border-radius: 10px;
    height: 50px;
    max-width: 525px;
    margin: auto;
    box-shadow: var(--chakra-shadows-dark-lg);
    blur: 8px;
    margin-top: 45px;
    
    div {
      transition: all 0.125s ease 0s;
      display: inline-block;
      border-radius: 10px;
      padding: 14px 0px;
      margin-top: -2px;
      width: calc( 100% / 3 );
      text-align: center;
      color: white;
      font-size: 16px;
      font-weight: 700;
      overflow: hidden;
      white-space: nowrap;

      &:hover {
        cursor: pointer;
      }

      @media (max-width: 500px) {
        font-size: 14px;
        padding: 16px 0px;
      }
      
      &.active {
        background-color: white;
        color: black;
        transform: scale(1.025);
        &:hover {
          cursor: default;
        }
      }

      &:nth-child(1) {
        margin-left: 0px;
      }
    }
  }
  @media (max-width: 650px) {
    .flex-logo {
      align: left;
      padding-top: 25px;
      .absolute {
        position: absolute !important;
        left: 40px !important;
        top: 24px !important;
      }
    }
    .setting-container {
      position: absolute;
      right: 25px; top: 22px;
    }
  }
`

export const HeaderNavbar: React.FC<HeaderNavbarProps> = ({ title }) => {
  const router = useLocation();
  const navigate = useNavigate();
  const pathname = router.pathname;
  const handleLinkClick = (path: string) => {
    navigate(path);
  };

  return (
    <Wrapper>
      <Container w="100vw" minW="100vw">
        <Flex
          direction={['column', 'column', 'row']}
          justify="space-between"
          align="center"
          py={4}
          gap={4}
        >
          <Box
            className="flex-logo"
            display="inline"
            mb={{ base: 5, md: 0 }}
          >
            <HashLink to="/" className="absolute">
              <Flex align="center">
                <Box as={FaSwimmingPool} boxSize={8} mr={4} />
                <Box as="h1" fontSize={['xl', '2xl']} fontWeight="bold" flex="1">
                  PRIVACY POOLS
                </Box>
              </Flex>
            </HashLink>
          </Box>

          <Flex direction="column" className="mobile-only">
            <HStack justifyContent="center" p={1}>
              <NoteWalletConnectButton />
              <Box p={1}>
                <CustomSettings />
              </Box>
            </HStack>
            <HStack justifyContent="center" p={1}>
              <ConnectButton
                accountStatus="address"
                chainStatus="icon"
                showBalance={{
                  smallScreen: true,
                  largeScreen: true
                }}
              />
            </HStack>
          </Flex>

          <Flex alignItems="center" gap={{ base: 2, md: 4 }} className="desktop-only">
            <NoteWalletConnectButton />
            <CustomSettings />
            <ConnectButton
              accountStatus="address"
              chainStatus="icon"
              showBalance={{
                smallScreen: true,
                largeScreen: true
              }}
            />
          </Flex>
        </Flex>

        <Box className="dapp-navigation">
          <Box onClick={() => handleLinkClick('/deposit')} className={`${pathname === '/deposit' ? 'active' : 'inactive'}`}>
            Deposit
          </Box>
          <Box onClick={() => handleLinkClick('/withdraw')} className={`${pathname === '/withdraw' ? 'active' : 'inactive'}`}>
            Withdraw
          </Box>
          <Box onClick={() => handleLinkClick('/explorer')} className={`${pathname === '/explorer' ? 'active' : 'inactive'}`}>
            Explorer
          </Box>
        </Box>
      </Container>
    </Wrapper>
  );
};

export default HeaderNavbar;
