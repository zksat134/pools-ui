import { useMemo } from 'react';
import { useAtom } from 'jotai';
import { usePublicClient } from 'wagmi';
import { assetSymbolAtom } from '../state/atoms';
import { tokens } from '../constants/tokens';

export function useAsset() {
  const { chain } = usePublicClient();
  const [assetSymbol] = useAtom(assetSymbolAtom);

  return useMemo(() => {
    if (chain) {
      return tokens[chain.id][assetSymbol];
    }
    return undefined
  }, [assetSymbol])
}
