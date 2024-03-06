import { Box, Button, Flex, Text, Tooltip } from '@chakra-ui/react';
import { useAtom } from 'jotai';
import { stageAtom } from '../../state';
import { AiOutlineInfoCircle } from 'react-icons/ai';

export default function Connect() {
  const [_stage, setStage] = useAtom(stageAtom);

  return (
    <Box>
      <Flex my={20} mx={4} direction="column">
        <Button
          onClick={() => setStage('Unlock')}
          my={2}
          px={{ base: '20px', lg: '30px' }}
          py={{ base: '10px', lg: '20px' }}
          bg="white"
          color="black"
          rounded="full"
          border="4px solid"
          _hover={{
            bg: 'black',
            color: 'white',
            borderColor: 'black',
            transform: 'scaleX(1.01)'
          }}
          transition="all 0.2s"
          fontWeight="semibold"
          boxShadow="xl"
          fontSize={{ base: 'xs', sm: 'sm', lg: 'md' }}
          w="100%"
        >
          {' '}
          Already Have A Note Wallet
        </Button>
        <Button
          onClick={() => setStage('Create')}
          my={2}
          px={{ base: '20px', lg: '30px' }}
          py={{ base: '10px', lg: '20px' }}
          bg="black"
          color="white"
          rounded="full"
          border="4px solid black"
          _hover={{
            bg: 'white',
            color: 'black',
            borderColor: 'black',
            transform: 'scaleX(1.01)'
          }}
          transition="all 0.2s"
          fontWeight="semibold"
          boxShadow="xl"
          fontSize={{ base: 'xs', sm: 'sm', lg: 'md' }}
          w="100%"
        >
          {' '}
          Create New Note Wallet
        </Button>
      </Flex>
      <Box
        textAlign="center"
        fontSize="xs"
        _hover={{
          cursor: 'pointer',
          fontWeight: 'bold'
        }}
      >
        <Tooltip
          label="NoteWallet is a hierarchical deterministic (HD) wallet. Based on the provided mnemonic phrase, NoteWallet generates a secret for each derived private key within the wallet. Each secret can be used to generate a commitment hash that is published on the Privacy Pool contract alongside each associated deposit. To generate a valid zkProof that can be used to withdraw from the Privacy Pool, one must possess the secret used to generate the commitment of a particular deposit."
          bg="gray.800"
          color="white"
          fontSize="sm"
          borderRadius="md"
        >
          <Flex alignItems="center" justifyContent="center">
            <AiOutlineInfoCircle />
            <Text ml={1}>What is Note Wallet?</Text>
          </Flex>
        </Tooltip>
      </Box>
    </Box>
  );
}
