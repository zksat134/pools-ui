import '@rainbow-me/rainbowkit/styles.css';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { ChakraProvider, Button } from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';
import * as React from 'react';
import { useAtom } from "jotai";
import { customRPC } from "../state";
import toast, { Toaster, ToastBar } from 'react-hot-toast';
import { WagmiConfig } from 'wagmi';
import { Client, Provider as UrqlProvider, cacheExchange, fetchExchange } from 'urql';
import '../styles.css'
import { routes } from '../constants/routes';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import { wagmiClient } from '../wagmi';

const urqlClient = new Client({
  url: 'https://api.thegraph.com/subgraphs/name/zksat134/sepolia-privacy-pools',
  exchanges: [cacheExchange, fetchExchange],
});

function App() {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  const [rpc] = useAtom(customRPC);
  const { chains, client } = wagmiClient(rpc);
  
  return (
    <Router>
      <UrqlProvider value={urqlClient}>
        <WagmiConfig config={client}>
          <RainbowKitProvider
            chains={chains}
            modalSize="wide"
            showRecentTransactions={true}
          >
            <ChakraProvider>
              {mounted && 
                <Routes>
                    {routes.map((r, i)=> {
                        const Component = r.component
                        if (r?.layout !== undefined) {
                          const Layout = r.layout
                          return <Route key={`r-${i.toString()}`} path={r.path} element={<Layout><Component /></Layout>}/>
                        }
                        return <Route key={`r-${i.toString()}`} path={r.path} element={<Component />}/>
                    })}
                </Routes>}
              <Toaster position="bottom-center">
                {(t) => (
                  <ToastBar toast={t}>
                    {({ icon, message }) => (
                      <>
                        {icon}
                        {message}
                        {t.type !== 'loading' && (
                          <Button
                            colorScheme="red"
                            variant="ghost"
                            size="xs"
                            onClick={() => toast.dismiss(t.id)}
                          >
                            <CloseIcon />
                          </Button>
                        )}
                      </>
                    )}
                  </ToastBar>
                )}
              </Toaster>
            </ChakraProvider>
          </RainbowKitProvider>
        </WagmiConfig>
      </UrqlProvider>
    </Router>
  );
}

export default App;
