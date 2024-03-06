import {
  Button,
  VStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  useDisclosure
} from '@chakra-ui/react';
import SubsetMaker from './SubsetMaker';

export function SubsetMakerButton() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button
        onClick={onOpen}
        bg="black"
        color="white"
        fontSize="lg"
        fontWeight="bold"
        _hover={{ bg: '#262626' }}
        w={['75%', '50%']}
        h='50px'
      >
        Subset Maker
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent minW="216px" maxW="960px" minH="100%">
          <ModalCloseButton />
          <ModalBody>
            <VStack align="center" justify="center">
              <SubsetMaker key="subset-maker"  />
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
