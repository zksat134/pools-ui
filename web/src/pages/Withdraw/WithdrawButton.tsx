import { Box, Button, Progress, Stack, Text } from '@chakra-ui/react';
import { AddressZero } from '@ethersproject/constants';
import { hashMod, subsetDataToBytes } from 'pools-ts';
import brotliPromise from 'brotli-wasm';
import { BigNumber } from 'ethers';
import {
  hexlify,
  hexZeroPad,
  parseUnits,
  getAddress,
  isAddress
} from 'ethers/lib/utils';
import { useAtom } from 'jotai';
import { usePublicClient } from 'wagmi';
import { NoteWalletConnectButton, SubsetMakerButton } from '../../components';
import {
  useAsset,
  useNote,
  useContractAddress,
  useAccessList,
  useDepositsTree,
  useZKeys,
} from '../../hooks';
import {
  relayerAtom,
  recipientAtom,
  feeAtom,
  deadlineAtom,
  zkProofAtom,
  spentNullifiersAtom,
} from '../../state';

interface WithdrawButtonProps {
  isFeeInvalid: boolean;
  isRelayerInvalid: boolean;
  leafIndex: number;
  nullifier: string;
  parsedAmount: string;
  loading: boolean;
  progress: number;
}

export const WithdrawButton: React.FC<WithdrawButtonProps> = ({
  isFeeInvalid,
  isRelayerInvalid,
  leafIndex,
  nullifier,
  parsedAmount,
  loading,
  progress
}) => {
  const [relayer] = useAtom(relayerAtom);
  const [recipient] = useAtom(recipientAtom);
  const [fee] = useAtom(feeAtom);
  const [deadline] = useAtom(deadlineAtom);
  const [_, setZkProof] = useAtom(zkProofAtom);
  const [spentNullifiers] = useAtom(spentNullifiersAtom);
  const asset = useAsset();
  const { chain } = usePublicClient();
  const { commitment, secret } = useNote();
  const { contractAddress } = useContractAddress();
  const { depositsTree } = useDepositsTree();
  const { accessList } = useAccessList();
  const { zkeyBytes, wasmBytes } = useZKeys();
  const snarkjs = window.snarkjs;

  const generateZkProof = async () => {
    if (
      !chain ||
      !asset ||
      !parsedAmount ||
      isNullifierInvalid ||
      isRecipientInvalid ||
      isRelayerInvalid ||
      isFeeInvalid ||
      !secret ||
      !nullifier ||
      (!leafIndex && leafIndex !== 0) ||
      depositsTree[chain.id][contractAddress].length === 0 ||
      accessList.length === 0 ||
      zkeyBytes.data.length === 0 ||
      wasmBytes.data.length === 0
    )
      return;
    try {
      // Compress subsetData using brotli
      const brotli = await brotliPromise;
      const bytesData = subsetDataToBytes(accessList.subsetData);
      const bufferData = Buffer.from(bytesData.data);
      const compressedData = brotli.compress(bufferData);

      const accessType = accessList.accessType === 'blocklist' ? 0 : 1;

      const { siblings: mainProof } = depositsTree[chain.id][contractAddress].generateProof(leafIndex);
      const { siblings: subsetProof } = accessList.generateProof(leafIndex);
      const assetMetadata = hashMod(
        ["address", "uint"],
        [asset.address, parsedAmount]
      );
      const withdrawMetadata = hashMod(
        ["address", "uint", "address", "uint", "uint", "uint8", "uint24", "bytes"],
        [recipient, 0, relayer, parseUnits(fee, asset.decimals), deadline, accessType, bytesData.bitLength, hexlify(compressedData)]
      );
      const input = {
        root: depositsTree[chain.id][contractAddress].root.toHexString(),
        subsetRoot: accessList.root.toHexString(),
        nullifier,
        assetMetadata: assetMetadata.toHexString(),
        withdrawMetadata: withdrawMetadata.toHexString(),
        secret: secret.toHexString(),
        path: leafIndex,
        mainProof: mainProof.map((b) => b.toHexString()),
        subsetProof: subsetProof.map((b) => b.toHexString())
      };
      const { proof, publicSignals } = await snarkjs.groth16.fullProve(
        input,
        wasmBytes,
        zkeyBytes
      );
      const solidityInput = {
        flatProof: [
          proof.pi_a[0],
          proof.pi_a[1],
          proof.pi_b[0][1],
          proof.pi_b[0][0],
          proof.pi_b[1][1],
          proof.pi_b[1][0],
          proof.pi_c[0],
          proof.pi_c[1]
        ],
        root: hexZeroPad(BigNumber.from(input.root).toHexString(), 32),
        subsetRoot: hexZeroPad(
          BigNumber.from(input.subsetRoot).toHexString(),
          32
        ),
        nullifier: hexZeroPad(
          BigNumber.from(input.nullifier).toHexString(),
          32
        ),
        token: asset.address.toString(),
        amount: parsedAmount.toString(),
        recipient: getAddress(recipient).toString(),
        refund: "0",
        relayer: getAddress(relayer).toString(),
        fee: parseUnits(fee, asset.decimals).toString(),
        deadline,
      };
      setZkProof({
        proof,
        publicSignals,
        solidityInput,
        metadata: {
          contractAddress,
          asset: asset.address,
          amount: BigNumber.from(parsedAmount),
          chainId: chain!.id,
          accessType: accessType,
          bitLength: bytesData.bitLength,
          subsetData: hexlify(compressedData),
          bytesData,
        }
      });
    } catch (err) {
      console.error(err);
    }
  };

  const isNullifierInvalid =
    Boolean(spentNullifiers[nullifier]) || BigNumber.from(nullifier).eq(0);

  const isRecipientInvalid = !recipient
    ? false
    : !isAddress(recipient) || Boolean(getAddress(recipient) === AddressZero);

  const isGenerateProofDisabled = Boolean(
    isNullifierInvalid ||
    isRecipientInvalid ||
    isRelayerInvalid ||
    isFeeInvalid ||
    !depositsTree ||
    !accessList ||
    !secret ||
    !nullifier ||
    !recipient ||
    !relayer ||
    !fee
  );

  return (
    <Stack
      direction={['column', 'row']}
      align="center"
      justify="center"
      py={4}
      px={4}
    >
      {loading ? (
        <Box position="relative" width="100%" alignItems="center" borderRadius={10} overflow="hidden">
          <Progress value={progress} colorScheme="blue" height="50px" />
          <Text
            position="absolute"
            top={0}
            left={0}
            right={0}
            textAlign="center"
            lineHeight="50px"
            fontWeight="bold"
            color="black"
            zIndex={1}
          >
            {`Generating Access List: ${Math.round(progress)}%`}
          </Text>
        </Box>
      ) : commitment.eq(0) ? (
        <NoteWalletConnectButton buttonProps={{ width: "100%", height: "50px", size: "lg" }} />
      ) : (
        <>
          <SubsetMakerButton />
          <Button
            w={['75%', '50%']}
            h='50px'
            colorScheme='blue'
            fontSize="lg"
            fontWeight="bold"
            isDisabled={isGenerateProofDisabled}
            onClick={generateZkProof}
          >
            Generate Proof
          </Button>
        </>
      )}
    </Stack>
  )
}
