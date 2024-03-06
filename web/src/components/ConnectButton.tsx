import { Box, Button } from '@chakra-ui/react';
import { ConnectButton } from '@rainbow-me/rainbowkit';

interface CustomConnectButtonProps {
  buttonProps?: React.ComponentProps<typeof Button>;
}

const CustomConnectButton: React.FC<CustomConnectButtonProps> = ({buttonProps}) => {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        const ready = mounted && authenticationStatus !== 'loading';
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus ||
            authenticationStatus === 'authenticated');

        return (
          <Box width="100%"
            {...(!ready && {
              'aria-hidden': true,
              'style': {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <Button
                    w="full"
                    height="50px"
                    size="lg"
                    colorScheme="blue"
                    borderRadius={10}
                    onClick={openConnectModal}
                    {...buttonProps}
                  >
                    Connect Wallet
                  </Button>
                );
              }

              if (chain.unsupported) {
                return (
                  <Button
                    w="full"
                    height="50px"
                    size="lg"
                    colorScheme="red"
                    borderRadius={10}
                    onClick={openChainModal}
                    {...buttonProps}
                  >
                    Wrong network
                  </Button>
                );
              }

              return (
                <div style={{ display: 'flex', gap: 12 }}>
                  <Button onClick={openAccountModal} type="button">
                    {account.displayBalance}
                    {' '}
                    {account.displayName}
                  </Button>
                </div>
              );
            })()}
          </Box>
        );
      }}
    </ConnectButton.Custom>
  );
};

export default CustomConnectButton;
