import { mnemonicToEntropy } from '@ethersproject/hdnode';
import { BigNumber } from 'ethers';
import { Wallet } from '@ethersproject/wallet';
import { NoteWallet } from './note_wallet';
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

export class NoteWalletV2 {
  public interiorKeys: {
    [key: string]: { secret: BigNumber; commitment: BigNumber };
  };
  public exteriorKeys: {
    [key: string]: { secret: BigNumber; commitment: BigNumber };
  };
  public mnemonic: string;

  constructor(mnemonic: string, index: number) {
    try {
      mnemonicToEntropy(mnemonic);
    } catch (err) {
      console.error(err);
      throw new Error(`Invalid mnemonic: ${err}`);
    }
    if (!index) index = 0;

    this.interiorKeys = {};
    this.exteriorKeys = {};
    this.interiorKeys[index] = generateInteriorKeys(mnemonic, index);
    this.exteriorKeys[index] = generateExteriorKeys(mnemonic, index);
    this.mnemonic = mnemonic;
  }

  newInteriorKeysFromPath(index: number) {
    if (typeof this.interiorKeys[index] === 'undefined') {
      this.interiorKeys[index] = generateInteriorKeys(this.mnemonic, index);
    }
    return this.interiorKeys[index];
  }

  newExteriorKeysFromPath(index: number) {
    if (typeof this.exteriorKeys[index] === 'undefined') {
      this.exteriorKeys[index] = generateExteriorKeys(this.mnemonic, index);
    }
    return this.exteriorKeys[index];
  }

  interiorNullifierAt(index: number, leafIndex: number) {
    if (typeof this.interiorKeys[index] === 'undefined') {
      this.interiorKeys[index] = generateInteriorKeys(this.mnemonic, index);
    }
    return poseidon([this.interiorKeys[index].secret, 1, leafIndex]);
  }

  exteriorNullifierAt(index: number, leafIndex: number) {
    if (typeof this.exteriorKeys[index] === 'undefined') {
      this.exteriorKeys[index] = generateExteriorKeys(this.mnemonic, index);
    }
    return poseidon([this.exteriorKeys[index].secret, 1, leafIndex]);
  }

  interiorKeysAt(index: number) {
    if (typeof this.interiorKeys[index] === 'undefined') {
      this.interiorKeys[index] = generateInteriorKeys(this.mnemonic, index);
    }
    return this.interiorKeys[index];
  }

  exteriorKeysAt(index: number) {
    if (typeof this.exteriorKeys[index] === 'undefined') {
      this.exteriorKeys[index] = generateExteriorKeys(this.mnemonic, index);
    }
    return this.exteriorKeys[index];
  }

  interiorIndexes() {
    return Object.keys(this.interiorKeys);
  }

  exteriorIndexes() {
    return Object.keys(this.exteriorKeys);
  }

  listInteriorKeys() {
    const interiorKeys = new Array();
    this.interiorIndexes().map((index) => {
      interiorKeys.push({ index, ...this.interiorKeys[index] });
    });
    return interiorKeys;
  }

  listExteriorKeys() {
    const exteriorKeys = new Array();
    this.exteriorIndexes().map((index) => {
      exteriorKeys.push({ index, ...this.exteriorKeys[index] });
    });
    return exteriorKeys;
  }

  interiorWithdrawKeysAt(index: number, leafIndex: number) {
    const nullifier = this.interiorNullifierAt(index, leafIndex);
    return { nullifier, ...this.interiorKeys[index] };
  }

  exteriorWithdrawKeysAt(index: number, leafIndex: number) {
    const nullifier = this.exteriorNullifierAt(index, leafIndex);
    return { nullifier, ...this.exteriorKeys[index] };
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
