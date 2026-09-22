import { Box } from '@mui/material';
import { useLocation, useNavigate } from 'react-router';
import { useBreakpoints } from '@hooks/index';
import PageTitle from '@components/page_title';
import TerritoryDoNotCalls from '@features/territories/do_not_calls';

const DoNotCallsPage = () => {
  const navigate = useNavigate();

  const parent = (useLocation().state as { parent?: string } | null)?.parent;
  const { tablet688Up } = useBreakpoints();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        paddingBottom: tablet688Up ? '0px' : '60px',
      }}
    >
      <PageTitle
        title="Do-not-call addresses"
        secondaryTitle={parent}
        onBack={() => (parent ? navigate(-1) : navigate('/territories'))}
      />

      <TerritoryDoNotCalls />
    </Box>
  );
};

export default DoNotCallsPage;
