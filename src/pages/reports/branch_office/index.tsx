import { Box } from '@mui/material';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import useBranchOffice from './useBranchOffice';
import BranchOfficeContainer from '@features/reports/branch_office';
import PageTitle from '@components/page_title';
import SubmitReport from '@features/reports/branch_office/submit_report';
import WithdrawReport from '@features/reports/branch_office/withdraw_report';

const BranchOffice = () => {
  const { t } = useAppTranslation();
  const { tablet688Up } = useBreakpoints();

  const {
    buttons,
    handleCloseSubmit,
    submitOpen,
    handleCloseWithdraw,
    withdrawOpen,
  } = useBranchOffice();

  return (
    <Box
      sx={{
        display: 'flex',
        gap: '16px',
        flexDirection: 'column',
        paddingBottom: !tablet688Up ? '60px' : 'none',
      }}
    >
      {submitOpen && (
        <SubmitReport open={submitOpen} onClose={handleCloseSubmit} />
      )}

      {withdrawOpen && (
        <WithdrawReport open={withdrawOpen} onClose={handleCloseWithdraw} />
      )}

      <PageTitle title={t('tr_branchOfficeReport')} buttons={buttons} />

      <BranchOfficeContainer />
    </Box>
  );
};

export default BranchOffice;
