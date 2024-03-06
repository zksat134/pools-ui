import {
  Button,
  FormControl,
  FormErrorMessage,
  Text,
  Input,
  Flex,
  Spacer
} from '@chakra-ui/react';
import { useAtom } from "jotai";
import { useState } from "react";
import { customRPC } from "../../state";
import Loader from "../Loader";
import { createPublicClient, http } from 'viem';
import { defineCustomChain } from '../../wagmi';

export default function CustomRPCSettings(): JSX.Element {
  const [rpc, setRPC] = useAtom(customRPC);
  const [inputRPC, setInputRPC] = useState('');
  const [saving, setSaving] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isErrored, setIsErrored] = useState(false);

  const onHandleChangeRPC = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputRPC(value);
  }

  const onHandleSave = async () => {
    if (inputRPC === rpc) return;
    setSaving(true)
    try {
      const chain = defineCustomChain(inputRPC);
      const publicClient = createPublicClient({
        chain: chain,
        transport: http(),
      });
      await publicClient.getBlockNumber();
      setRPC(inputRPC);
      localStorage.setItem('privacy-pools-custom-rpc', inputRPC);
      setIsErrored(false);
      setErrorMessage('');
      setInputRPC('');
      setSaving(false);
    } catch (error) {
      console.error(`Invalid RPC: ${error}`);
      setIsErrored(true);
      setErrorMessage('Invalid URL')
      setSaving(false);
    }
  }

  const resetToDefault = async () => {
    setRPC('');
    setInputRPC('');
    localStorage.removeItem('privacy-pools-custom-rpc');
    setIsErrored(false);
    setErrorMessage('');
  }

  return (
    <>
      <Flex direction="column" pb={6}>
        <Flex >
          <Text>Sepolia RPC</Text>
          <Spacer />
          <FormControl isInvalid={isErrored}>
            <Input
              bg="gray.50"
              type="text"
              size="md"
              border="solid 1px rgba(200, 200, 200, 0.25)"
              value={inputRPC ? inputRPC : rpc ?? ''}
              onChange={(e) => onHandleChangeRPC(e)}
              placeholder='eg. "https://rpc.sepolia.org"'
            />
            <FormErrorMessage>{errorMessage}</FormErrorMessage>
          </FormControl>
        </Flex>
      </Flex>
      <Flex
        w="100%"
        justify="center"
        align="center"
        direction={{ base: 'column', sm: 'row' }}
      >
        <Button
          w="100%"
          boxShadow="xl"
          bg="black"
          color="white"
          variant="outline"
          onClick={resetToDefault}
          borderRadius={10}
          height="40px"
          _hover={{ bg: '#262626' }}
          mb={{ base: 2, sm: 0 }}
          mr={{ base: 0, sm: 2 }}
        >
          Reset
        </Button>
        <Button
          colorScheme="blue"
          w="100%"
          onClick={onHandleSave}
          disabled={saving}
          borderRadius={10}
          ml={{ base: 0, sm: 2 }}
        >
          {saving ? <Loader /> : "Save"}
        </Button>
      </Flex>
    </>
  )
}
