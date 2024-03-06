import { BigNumber } from 'ethers';
import { hexZeroPad } from 'ethers/lib/utils';
import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { zeroAddress } from 'viem';
import { AccessList, BytesData } from 'pools-ts';
import { DepositsTrees, getEmptyDepositsTree } from '../constants'

export type EncryptedJson = {
  address?: string;
  crypto?: {
    cipher: string;
    cipherparams: {
      iv: string;
    };
    ciphertext: string;
  };
  kdf?: string;
  kdfparams?: {
    dklen: number;
    n: number;
    p: number;
    r: number;
    salt: string;
  };
  mac?: string;
  id?: string;
  version?: number;
  'x-ethers'?: {
    client: string;
    gethFilename: string;
    locale: string;
    mnemonicCiphertext: string;
    mnemonicCounter: string;
    path: string;
    version: string;
  };
};

export type Commitment = {
  commitment: string;
  leafIndex: string;
  sender: string;
  asset: string;
  denomination: BigNumber;
  leaf: string;
  pool: {
    id: string;
  };
};

export type SubsetRoot = {
  subsetRoot: string;
  relayer: string;
  recipient: string;
  nullifier: string;
  sender: string;
};

export type Note = {
  commitment: BigNumber;
  secret: BigNumber;
  index: number;
};

export type Proof = {
  pi_a: BigNumber[];
  pi_b: BigNumber[][];
  pi_c: BigNumber[];
};

export type SolidityInput = {
  flatProof: string[];
  root: string;
  subsetRoot: string;
  nullifier: string;
  token: string;
  amount: string;
  recipient: string;
  refund: string;
  relayer: string;
  fee: string;
  deadline: string;
};

export type ZKProofMetadata = {
  contractAddress: string;
  asset: string;
  amount: BigNumber;
  chainId: number;
  accessType: number;
  bitLength: number;
  subsetData: string;
  bytesData: BytesData;
};

export type ZKProof = {
  proof: Proof;
  publicSignals: BigNumber[];
  solidityInput: SolidityInput;
  metadata: ZKProofMetadata;
};

export type RecentWithdrawal = {
  recipient: string;
  nullifier: string;
  subsetRoot: string;
  relayer?: string;
  denomination?: string;
  fee?: string;
};

export type ZKeyOrWasm = {
  type: 'mem';
  data: Buffer;
};

type Stage = 'Connect' | 'Unlock' | 'Manage' | 'Create';

// note wallet
export const DefaultNote: Note = {
  index: 0,
  commitment: BigNumber.from(0),
  secret: BigNumber.from(0)
};
export const stageAtom = atom<Stage>('Connect');
export const mnemonicAtom = atom<string>('');
export const noteAtom = atom<Note>(DefaultNote);
export const encryptedJsonAtom = atomWithStorage<EncryptedJson>(
  'encryptedJson',
  {}
);
export const activeIndexAtom = atomWithStorage<number>('activeIndex', 0);
export const downloadUrlAtom = atom<string>('');

// pool explorer
export const assetSymbolAtom = atom<string>('SEP');
export const denominationAtom = atom<string>('0.001');

// withdraw form
export const nullifierAtom = atom<BigNumber>(BigNumber.from(0));
export const leafIndexAtom = atom<number>(NaN);
export const recipientAtom = atom<string>('');
export const relayerAtom = atom<string>(zeroAddress);
export const feeAtom = atom<string>('0');
export const deadlineAtom = atom<string>('0');
export const zkProofAtom = atom<ZKProof | null>(null);

// withdrawals
export const subsetRootsAtom = atom<SubsetRoot[]>([]);
export const spentNullifiersAtom = atom<Record<string, boolean>>((get) => {
  const nullifiers = get(subsetRootsAtom).map(
    (subsetRoot) => subsetRoot.nullifier
  );
  const spentNullifiers: Record<string, boolean> = {};
  for (const nullifier of nullifiers) {
    spentNullifiers[hexZeroPad(nullifier.toString(), 32)] = true;
  }
  return spentNullifiers;
});
export const blockedAddressesAtom = atom(localStorage.getItem('privacy-pools-blocklist'));

// deposits
export const commitmentsAtom = atom<Commitment[]>([]);
export const depositsTreeAtom = atom<DepositsTrees>(getEmptyDepositsTree());

// withdrawal subsets
export const accessListAtom = atom<AccessList>(
  new AccessList({ accessType: 'blocklist' })
);
export const subsetRootAtom = atom<BigNumber>(
  (get) => get(accessListAtom).root
);

// explorer
export type SubsetMetaData = {
  accessType: string;
  bitLength: number;
  subsetData: Buffer;
};

export const subsetMetadataAtom = atom<SubsetMetaData>({
  accessType: '',
  bitLength: NaN,
  subsetData: Buffer.alloc(0)
});

export const recentWithdrawalAtom = atom<RecentWithdrawal>({
  recipient: '',
  nullifier: '',
  subsetRoot: ''
});

// zkeys
export const zkeyBytesAtom = atom<ZKeyOrWasm>({
  type: 'mem',
  data: Buffer.alloc(0)
});
export const wasmBytesAtom = atom<ZKeyOrWasm>({
  type: 'mem',
  data: Buffer.alloc(0)
});

// custom rpc settings
export const customRPC = atom(localStorage.getItem('privacy-pools-custom-rpc'))
