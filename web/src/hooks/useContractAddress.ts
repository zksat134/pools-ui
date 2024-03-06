import { usePublicClient } from 'wagmi';
import { contracts, privacyPoolFactories } from '../constants';
import { useAtom } from 'jotai';
import { assetSymbolAtom, denominationAtom } from '../state/atoms';

export function useContractAddress() {
  const { chain } = usePublicClient();
  const [assetSymbol] = useAtom(assetSymbolAtom);
  const [denomination] = useAtom(denominationAtom);

  if (!chain || !Object.keys(contracts).includes(chain.id.toString()))
    return { contractAddress: '', subsetFactory: '' };

  return {
    contractAddress: contracts[chain.id][`${assetSymbol}-${denomination}`],
    subsetFactory: privacyPoolFactories[chain.id]
  };
}
