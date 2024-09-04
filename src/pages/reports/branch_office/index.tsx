import { Box } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import useBranchOffice from './useBranchOffice';
import BranchOfficeContainer from '@features/reports/branch_office';
import PageTitle from '@components/page_title';

const BranchOffice = () => {
  const { t } = useAppTranslation();

  const { buttons } = useBranchOffice();

  return (
    <Box
      sx={{
        display: 'flex',
        gap: '16px',
        flexDirection: 'column',
      }}
    >
      <PageTitle title={t('tr_branchOfficeReport')} buttons={buttons} />

      <BranchOfficeContainer />
    </Box>
  );
};

export default BranchOffice;
