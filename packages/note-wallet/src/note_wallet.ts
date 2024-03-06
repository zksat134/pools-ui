import { mnemonicToEntropy } from '@ethersproject/hdnode';
import { BigNumber } from 'ethers';
import { Wallet } from '@ethersproject/wallet';
import { poseidon } from 'pools-ts';
const { ZqField, Scalar } = require('ffjavascript');

// see: https://github.com/satoshilabs/slips/blob/master/slip-0044.md
const coinType = 9777;

function interiorHdPath(index: number) {
  return `m/44'/${coinType}'/0'/0/${index}`;
}

function exteriorHdPath(index: number) {
  return `m/44'/${coinType}'/0'/1/${index}`;
}

const F = new ZqField(
  Scalar.fromString(
    '21888242871839275222246405745257275088548364400416034343698204186575808495617'
  )
);

function generateInteriorKeys(mnemonic: string, index: number) {
  const wallet = Wallet.fromMnemonic(mnemonic, interiorHdPath(index));
  const secret = BigNumber.from(F.e(wallet.privateKey) % F.p);
  const commitment = poseidon([secret]) as BigNumber;
  return { secret, commitment };
}

function generateExteriorKeys(mnemonic: string, index: number) {
  const wallet = Wallet.fromMnemonic(mnemonic, exteriorHdPath(index));
  const secret = BigNumber.from(F.e(wallet.privateKey) % F.p);
  const commitment = poseidon([secret]) as BigNumber;
  return { secret, commitment };
}

export class NoteWallet {
  public secret: BigNumber;
  public commitment: BigNumber;
  public mnemonic: string;

  constructor(mnemonic: string, index: number) {
    try {
      mnemonicToEntropy(mnemonic);
    } catch (err) {
      console.error(err);
      throw new Error(`Invalid mnemonic: ${err}`);
    }
    if (!index) index = 0;
    this.secret = BigNumber.from(0);
    this.commitment = BigNumber.from(0);
    this.mnemonic = mnemonic;
    this.newInteriorKeysFromPath(index);
  }

  newInteriorKeysFromPath(index: number) {
    const { secret, commitment } = generateInteriorKeys(this.mnemonic, index);
    this.secret = secret;
    this.commitment = commitment;
  }

  newExteriorKeysFromPath(index: number) {
    const { secret, commitment } = generateExteriorKeys(this.mnemonic, index);
    this.secret = secret;
    this.commitment = commitment;
  }

  nullifierAt(leafIndex: number) {
    return poseidon([this.secret, 1, leafIndex]);
  }

  keys() {
    return { secret: this.secret, commitment: this.commitment };
  }

  keysAt(leafIndex: number) {
    return {
      secret: this.secret,
      commitment: this.commitment,
      nullifier: this.nullifierAt(leafIndex)
    };
  }

  async encryptToJson(password: string, options?: any, progressCallback?: any) {
    return Wallet.fromMnemonic(this.mnemonic, interiorHdPath(0)).encrypt(
      password,
      options,
      progressCallback
    );
  }

  static async fromEncryptedJson(
    json: string,
    password: string,
    progressCallback?: any
  ) {
    return Wallet.fromEncryptedJson(json, password, progressCallback).then(
      (wallet) => {
        return new NoteWallet(wallet.mnemonic.phrase, 0);
      }
    );
  }

  static fromEncryptedJsonSync(json: string, password: string) {
    return new NoteWallet(
      Wallet.fromEncryptedJsonSync(json, password).mnemonic.phrase,
      0
    );
  }
}
