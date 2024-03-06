import {
  Box,
  Flex,
  Image,
  Text,
  Button
} from '@chakra-ui/react';
import { Link as HashLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AiOutlineDown } from 'react-icons/ai';

const variants = {
  hidden: {
    opacity: 1,
    y: 15
  },
  visible: {
    opacity: 1,
    y: 0
  }
};

const HeroSection: React.FC = () => {
  return (
    <Box>
      <Box minH="100vh" display="flex" alignItems="center">
        <Box>
          <motion.div
            variants={variants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5 }}
          >
            <Flex direction="column" alignItems="center">
              <Flex direction={{ base: 'column', lg: 'row' }} alignItems="top">
                <Box mt={{ base: 2, md: 2 }}>
                  <Text
                    fontSize={{ base: '3xl', md: '4xl', lg: '5xl' }}
                    fontWeight="bold"
                    mb={4}
                    pr={{ base: 0, lg: 200 }}
                    textAlign={{
                      base: 'center',
                      lg: 'left'
                    }}
                  >
                    A New Privacy Protocol for Ethereum
                  </Text>
                  <Text
                    fontSize={{ base: 'md', md: 'lg' }}
                    lineHeight="tall"
                    mr={{ base: 0, lg: 40 }}
                    textAlign={{
                      base: 'center',
                      lg: 'left'
                    }}
                  >
                    Privacy Pools allow you to generate a brand new Ethereum
                    address that is completely unlinkable to any prior transaction history.
                    Most importantly, you can choose your own association sets of deposits
                    and prove them on-chain!
                  </Text>
                  <Box
                    display="inline"
                    textDecoration="none"
                    _hover={{ textDecoration: 'none' }}
                  >
                    <HashLink to="/deposit" target="_blank">
                      <Button
                        mt={10}
                        mr={{
                          base: 'auto',
                          lg: '0'
                        }}
                        ml={{
                          base: 'auto',
                          lg: '0'
                        }}
                        mb={{
                          base: 10,
                          lg: 0,
                        }}
                        px={4}
                        py={2}
                        bg="black"
                        color="white"
                        rounded="full"
                        border="4px solid black"
                        _hover={{
                          bg: 'gray.100',
                          color: 'black',
                          borderColor: 'black',
                          transform: 'scaleX(1.05)',
                          textDecoration: 'none'
                        }}
                        transition="all 0.2s"
                        fontWeight="semibold"
                        boxShadow="2xl"
                        display={{
                          base: 'block',
                          md: 'block'
                        }}
                      >
                        GET PRIVACY NOW
                      </Button>
                    </HashLink>
                  </Box>
                </Box>
                <Box
                  w={{ base: '100%', lg: '50%' }}
                  textAlign={{ base: 'center', lg: 'right' }}
                  mt={{ base: 8, md: 0 }}
                  mr={50}
                >
                  <motion.div
                    variants={variants}
                    initial="hidden"
                    animate="visible"
                    transition={{
                      duration: 0.95,
                      delay: 0.95,
                      repeat: Infinity,
                      repeatType: 'reverse'
                    }}
                  >
                    <Image
                      boxSize={{
                        base: '350px',
                        lg: '450px'
                      }}
                      mr={{
                        base: 'auto',
                      }}
                      ml={{
                        base: 'auto',
                      }}
                      src="eth_pools_logo_bw.svg"
                      alt="Image"
                      align="center"
                    />
                  </motion.div>
                </Box>
              </Flex>
              <Box
                position="relative"
                bottom="-40px"
                textAlign="center"
                alignSelf="center"
                mt={{ base: 20, md: 40 }}
              >
                <Text
                  fontSize={{ base: 'md', md: 'lg' }}
                  fontWeight="bold"
                  mb={2}
                >
                  Scroll now to learn how Privacy Pools protect you from bad
                  depositors.
                </Text>
                <Button
                  size="lg"
                  disabled={true}
                  _hover={{ bg: 'none' }}
                  _active={{ bg: 'none' }}
                  cursor='pointer'
                  bg="none"
                >
                  <AiOutlineDown />
                </Button>
              </Box>
            </Flex>
          </motion.div>
        </Box>
      </Box>
    </Box>
  );
};

export default HeroSection;
