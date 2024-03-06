import { expect } from 'chai'
import { ethers, BigNumber } from 'ethers'
import { NoteWalletV2 } from '../src/note_walletV2'

describe('notw_walletV2.ts', function() {
  it('Should create new note wallet', () => {
    const wallet = ethers.Wallet.createRandom();

    const noteWallet = new NoteWalletV2(wallet.mnemonic.phrase, 0);

    console.log(noteWallet.interiorNullifierAt(5,0))
  })
})
