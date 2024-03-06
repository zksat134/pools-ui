import React from 'react';
import {
  Box,
  BoxProps,
  Flex,
} from '@chakra-ui/react';
import HeaderNavbar from './HeaderNavbar';
import DappFooter from './DappFooter';

interface LayoutProps extends BoxProps {
  children?: React.ReactNode;
  title?: string;
}

export const DappLayout: React.FC<LayoutProps> = ({
  title,
  children,
  ...boxProps
}) => {
  return (
    <Box
      minH="100vh"
      minW="100vw"
      w="100vw"
      h="100%"
      pb={0}
      mt="0"
      backdropBlur="80px"
      overflow="scroll"
      bgGradient="linear-gradient(45deg, #b8faf480 0%, #a8bdfc80 25%, #c5b0f680 50%, #ffe5f980 75%, #f0ccc380 100%)"
    >
      <HeaderNavbar title={title} />

      <Box {...boxProps} mb={10}>
        {children}
      </Box>
      <Flex mt={10}>
        <DappFooter />
      </Flex>
    </Box>
  );
};

export default DappLayout;
