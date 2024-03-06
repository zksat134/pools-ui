import { useEffect, useState, useMemo } from 'react';
import { Container } from '@chakra-ui/react';
import {
  hexZeroPad,
  isAddress,
  parseUnits,
} from 'ethers/lib/utils';
import { useAtom } from 'jotai';
import {
  denominationAtom,
  zkProofAtom,
  spentNullifiersAtom,
  relayerAtom,
  feeAtom,
} from '../../state';
import {
  useAccessList,
  useAsset,
  useNote,
  useContractAddress,
  useSubsetRoots,
  useExistingCommitments,
} from '../../hooks';
import { isDecimalNumber } from '../../utils';
import { DepositsTable } from './DepositsTable';
import { WithdrawButton } from './WithdrawButton';
import { WithdrawMainContainer } from './WithdrawMainContainer';
import { WithdrawExecute } from './WithdrawExecute';

function Withdraw() {
  const asset = useAsset();
  const [leafIndex, setLeafIndex] = useState(NaN);
  const [zkProof] = useAtom(zkProofAtom);
  const [spentNullifiers] = useAtom(spentNullifiersAtom);
  const { commitment } = useNote();
  const { contractAddress } = useContractAddress();
  const { subsetRoots } = useSubsetRoots();
  const { existingCommitments, leafIndexToIndex } = useExistingCommitments();
  const [denomination] = useAtom(denominationAtom);
  const [relayer] = useAtom(relayerAtom);
  const [fee] = useAtom(feeAtom);
  const { loading, progress } = useAccessList();
  const [exportWithdrawData, setExportWithdrawData] = useState<boolean>(true);

  const parsedAmount = useMemo(() => {
    return parseUnits(denomination, asset?.decimals).toString()
  }, [asset, denomination])

  const nullifier =
    isNaN(leafIndex) ||
      existingCommitments.length === 0 ||
      typeof leafIndexToIndex[leafIndex] === 'undefined'
      ? '0x0000000000000000000000000000000000000000000000000000000000000000'
      : existingCommitments[leafIndexToIndex[leafIndex]].nullifier;

  useEffect(() => {
    if (
      (isNaN(leafIndex) ||
        typeof leafIndexToIndex[leafIndex] === 'undefined') &&
      existingCommitments.length > 0 &&
      subsetRoots.length > 0 &&
      subsetRoots.length === Object.keys(spentNullifiers).length
    ) {
      for (let i = 0; i < existingCommitments.length; i++) {
        if (spentNullifiers[hexZeroPad(existingCommitments[i].nullifier, 32)] === undefined) {
          setLeafIndex(Number(existingCommitments[i].leafIndex.toString()));
          break;
        }
      }
    } else if (
      (isNaN(leafIndex) ||
        typeof leafIndexToIndex[leafIndex] === 'undefined') &&
      existingCommitments.length > 0 &&
      subsetRoots.length === 0
    ) {
      setLeafIndex(Number(existingCommitments[0].leafIndex.toString()));
    }
  }, [
    subsetRoots,
    leafIndexToIndex,
    leafIndex,
    existingCommitments,
    spentNullifiers
  ]);

  const isRelayerInvalid = !isAddress(relayer);

  const isFeeInvalid =
    !fee || Number(fee) === 0
      ? false
      : !isDecimalNumber(fee) ||
      Boolean(parseUnits(fee, asset?.decimals).gte(parsedAmount));

  return (
    <>
      <Container minW="216px" maxW="98vw">
        <Container
          bg="white"
          px={0}
          my={8}
          borderRadius={10}
          boxShadow="2xl"
          opacity={loading ? 0.8 : 1}
          pointerEvents={loading ? "none" : "auto"}
        >
          {zkProof && zkProof.proof.pi_a.length > 0 ?
            <WithdrawExecute exportWithdrawData={exportWithdrawData} /> : (
              <>
                <WithdrawMainContainer
                  isFeeInvalid={isFeeInvalid}
                  isRelayerInvalid={isRelayerInvalid}
                  nullifier={nullifier}
                  exportWithdrawData={exportWithdrawData}
                  setExportWithdrawData={setExportWithdrawData}
                />
                <WithdrawButton
                  isFeeInvalid={isFeeInvalid}
                  isRelayerInvalid={isRelayerInvalid}
                  leafIndex={leafIndex}
                  nullifier={nullifier}
                  parsedAmount={parsedAmount}
                  loading={loading}
                  progress={progress}
                />
              </>
            )
          }
        </Container>

        {!loading && !commitment.eq(0) && (
          <DepositsTable
            commitment={commitment}
            contractAddress={contractAddress}
            existingCommitments={existingCommitments}
            nullifier={nullifier}
            spentNullifiers={spentNullifiers}
          />
        )}
      </Container>
    </>
  );
}

export default Withdraw;
