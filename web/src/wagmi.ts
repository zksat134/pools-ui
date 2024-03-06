import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import {
  metaMaskWallet,
  coinbaseWallet,
  walletConnectWallet,
  rainbowWallet,
  injectedWallet
} from '@rainbow-me/rainbowkit/wallets';
import { configureChains, createConfig } from 'wagmi';
import { defineChain } from 'viem';
import { sepolia } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';

const projectId = 'fb0713a47c49c9832f64e77063dad0c8';

export const defineCustomChain = (customRPC: string) => {
  return defineChain({
    ...sepolia,
    rpcUrls: {
      default: { http: [customRPC] },
      public: { http: [customRPC] },
    },
  });
}

export const wagmiClient = (customRPC: string | null) => {
  const customChain = customRPC ? defineCustomChain(customRPC) : null;

  const { chains, publicClient } = configureChains(
    [customChain ?? sepolia],
    [
      jsonRpcProvider({
        rpc: (chain) => {
          return { http: chain.rpcUrls.default.http[0] }
        },
      }),
      publicProvider()
    ]
  );
  const connectors = connectorsForWallets([
    {
      groupName: 'Recommended',
      wallets: [
        injectedWallet({ chains: chains }),
        metaMaskWallet({ projectId, chains: chains }),
        rainbowWallet({ projectId, chains: chains }),
        coinbaseWallet({ appName: 'privacy-pools', chains: chains }),
        walletConnectWallet({ projectId, chains: chains })
      ]
    }
  ]);
  return {
    chains,
    client: createConfig({
      autoConnect: true,
      connectors,
      publicClient,
    })
  };
}
