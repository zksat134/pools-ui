import {
  Center,
  IconButton,
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useDisclosure,
} from '@chakra-ui/react';
import CustomRPCSettings from './CustomRPCSettings';
import BlocklistSettings from './BlocklistSettings';
import { growShrinkProps } from '../../utils';

export default function CustomSettings(): JSX.Element {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <IconButton
        aria-label='settings'
        background="white"
        icon={<Image src="./images/gear.png" />}
        onClick={onOpen}
        {...growShrinkProps}
      />
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="xl"
        isCentered
        motionPreset="slideInBottom"
      >
        <ModalOverlay />
        <ModalContent borderRadius="xl" bg="white">
          <ModalHeader>
            <Center flex="1">Settings</Center>
          </ModalHeader>
          <ModalCloseButton
            size="md"
            p={2}
            borderRadius="50%"
          />
          <ModalBody p={2}>
            <Tabs>
              <TabList>
                <Tab>Custom RPC</Tab>
                <Tab>Blocklist</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <CustomRPCSettings />
                </TabPanel>
                <TabPanel>
                  <BlocklistSettings />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
