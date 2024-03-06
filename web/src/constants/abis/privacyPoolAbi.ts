export const privacyPoolABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "poseidon",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_asset",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_denomination",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "IncrementalMerkleTree__MerkleTreeCapacity",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "PrivacyPool__CallExpired",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "PrivacyPool__DenominationInvalid",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "PrivacyPool__FeeExceedsDenomination",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "PrivacyPool__InvalidZKProof",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "PrivacyPool__MsgValueInvalid",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "PrivacyPool__NoteAlreadySpent",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "expected",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "provided",
        "type": "address"
      }
    ],
    "name": "PrivacyPool__RelayerMismatch",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "PrivacyPool__UnknownRoot",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "PrivacyPool__ZeroAddress",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "ProofLib__ECAddFailed",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "ProofLib__ECMulFailed",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "ProofLib__ECPairingFailed",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "ProofLib__GteSnarkScalarField",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "ProofLib__PairingLengthsFailed",
    "type": "error"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "commitment",
        "type": "bytes32"
      },
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "leaf",
        "type": "bytes32"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "asset",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "denomination",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "leafIndex",
        "type": "uint256"
      }
    ],
    "name": "Deposit",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "recipient",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "relayer",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "subsetRoot",
        "type": "bytes32"
      },
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "nullifier",
        "type": "bytes32"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "fee",
        "type": "uint256"
      }
    ],
    "name": "Withdrawal",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "LEVELS",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "NATIVE",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "ROOTS_CAPACITY",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "asset",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "currentLeafIndex",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "denomination",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "commitment",
        "type": "bytes32"
      }
    ],
    "name": "deposit",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32[]",
        "name": "commitments",
        "type": "bytes32[]"
      }
    ],
    "name": "depositMany",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "leafIndices",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "filledSubtrees",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getLatestRoot",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "hasher",
    "outputs": [
      {
        "internalType": "contract IPoseidon",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "root",
        "type": "bytes32"
      }
    ],
    "name": "isKnownRoot",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "name": "nullifiers",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "roots",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "enum PrivacyPool.AccessType",
            "name": "accessType",
            "type": "uint8"
          },
          {
            "internalType": "uint24",
            "name": "bitLength",
            "type": "uint24"
          },
          {
            "internalType": "bytes",
            "name": "subsetData",
            "type": "bytes"
          },
          {
            "internalType": "uint256[8]",
            "name": "flatProof",
            "type": "uint256[8]"
          },
          {
            "internalType": "bytes32",
            "name": "root",
            "type": "bytes32"
          },
          {
            "internalType": "bytes32",
            "name": "subsetRoot",
            "type": "bytes32"
          },
          {
            "internalType": "bytes32",
            "name": "nullifier",
            "type": "bytes32"
          },
          {
            "internalType": "address",
            "name": "recipient",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "refund",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "relayer",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "fee",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "deadline",
            "type": "uint256"
          }
        ],
        "internalType": "struct PrivacyPool.WithdrawalProof",
        "name": "proof",
        "type": "tuple"
      }
    ],
    "name": "verifyWithdrawal",
    "outputs": [],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "components": [
              {
                "internalType": "enum PrivacyPool.AccessType",
                "name": "accessType",
                "type": "uint8"
              },
              {
                "internalType": "uint24",
                "name": "bitLength",
                "type": "uint24"
              },
              {
                "internalType": "bytes",
                "name": "subsetData",
                "type": "bytes"
              },
              {
                "internalType": "uint256[8]",
                "name": "flatProof",
                "type": "uint256[8]"
              },
              {
                "internalType": "bytes32",
                "name": "root",
                "type": "bytes32"
              },
              {
                "internalType": "bytes32",
                "name": "subsetRoot",
                "type": "bytes32"
              },
              {
                "internalType": "bytes32",
                "name": "nullifier",
                "type": "bytes32"
              },
              {
                "internalType": "address",
                "name": "recipient",
                "type": "address"
              },
              {
                "internalType": "uint256",
                "name": "refund",
                "type": "uint256"
              },
              {
                "internalType": "address",
                "name": "relayer",
                "type": "address"
              },
              {
                "internalType": "uint256",
                "name": "fee",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "deadline",
                "type": "uint256"
              }
            ],
            "internalType": "struct PrivacyPool.WithdrawalProof",
            "name": "proof",
            "type": "tuple"
          },
          {
            "internalType": "address",
            "name": "feeReceiver",
            "type": "address"
          }
        ],
        "internalType": "struct PrivacyPool.WithdrawalRequest",
        "name": "withdrawRequest",
        "type": "tuple"
      }
    ],
    "name": "withdraw",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  }
];