import { usePublicClient } from 'wagmi';
import { tokens, Token } from '../constants/tokens';
import { denominations } from '../constants';
import { useAtom } from 'jotai';
import { assetSymbolAtom } from '../state/atoms';

export function useOptions() {
  const [assetSymbol] = useAtom(assetSymbolAtom);
  const { chain } = usePublicClient()

  let assetOptions: Token[] = [];
  let denominationOptions: number[] = [];

  if (!chain || !chain.id) {
    return { assetOptions, denominationOptions };
  }

  if (tokens[chain.id]) {
    assetOptions = Object.values(tokens[chain.id]);
  }

  if (
    Object.keys(denominations).includes(chain.id.toString()) &&
    Array.isArray(denominations[chain.id][assetSymbol])
  ) {
    denominationOptions = denominations[chain.id][assetSymbol];
  }

  return { assetOptions, denominationOptions };
}
