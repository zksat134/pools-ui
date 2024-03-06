import { useCommitments, useSubsetRoots } from '../../hooks';
import { DepositModal } from './DepositModal';
import { DepositsTable } from './DepositsTable';
import { WithdrawalsTable } from './WithdrawalsTable';

function Deposit() {
  const { commitments } = useCommitments();
  const { subsetRoots } = useSubsetRoots();

  return (
    <>
      <DepositModal />
      {Array.isArray(commitments) && commitments.length > 0 && <DepositsTable />}
      {Array.isArray(subsetRoots) && subsetRoots.length > 0 && <WithdrawalsTable />}
    </>
  );
}

export default Deposit;
