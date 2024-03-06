import React from 'react';
import {
  Box,
  BoxProps,
  Container,
  Heading,
  Flex,
  Stack
} from '@chakra-ui/react';
import { Link as HashLink } from 'react-router-dom';
const growShrinkProps = {
  _hover: {
    transform: 'scale(1.025)'
  },
  _active: {
    transform: 'scale(0.95)'
  },
  transition: '0.125s ease'
};

interface LayoutProps extends BoxProps {
  children?: React.ReactNode;
  title?: string;
}

export const HomeLayout: React.FC<LayoutProps> = ({
  title,
  children,
  ...boxProps
}) => {
  return (
    <>
      <Container maxW="98vw" minW="216px">
        <Flex
          direction={['column', 'column', 'row']}
          justify="space-between"
          align="center"
          m={4}
          gap={4}
        >
          <Heading size="lg">🌊 Privacy Pools</Heading>
          <Container w="fit-content">
            <Stack
              color="blue.800"
              fontWeight="bold"
              justifyContent="center"
              alignItems="center"
              direction={['column', 'row']}
              px={8}
              py={2}
              gap={[0, 8]}
            >
              <Box {...growShrinkProps}>
                <HashLink to="/deposit">
                  Deposit
                </HashLink>
              </Box>

              <Box {...growShrinkProps}>
                <HashLink to="/withdraw">
                  Withdraw
                </HashLink>
              </Box>

              <Box {...growShrinkProps}>
                <HashLink to="/explorer">
                  Explorer
                </HashLink>
              </Box>
            </Stack>
          </Container>
        </Flex>
      </Container>

      <Box {...boxProps}>{children}</Box>
    </>
  );
};

export default HomeLayout;
