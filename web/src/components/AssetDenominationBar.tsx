import {
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Stack,
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { useAtom } from 'jotai';
import { useOptions } from '../hooks';
import { assetSymbolAtom, denominationAtom } from '../state';

export function AssetDenominationBar() {
  const [assetSymbol, setAssetSymbol] = useAtom(assetSymbolAtom);
  const [denomination, setDenomination] = useAtom(denominationAtom);
  const { assetOptions, denominationOptions } = useOptions();

  return (
    <Stack direction={['row']}>
      <Menu>
        <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
          {denomination}
        </MenuButton>
        <MenuList>
          {denominationOptions.map((_denomination, i) => (
            <MenuItem
              value={_denomination}
              key={`${_denomination}-${i}-option`}
              onClick={() => setDenomination(_denomination.toString())}
            >
              {_denomination}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>

      <Menu>
        <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
          {assetSymbol}
        </MenuButton>
        <MenuList>
          {assetOptions.map((_asset, i) => (
            <MenuItem
              value={_asset.address}
              key={`${_asset}-${i}-option`}
              onClick={() => setAssetSymbol(_asset.symbol)}
            >
              {_asset.name}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    </Stack>
  );
}
