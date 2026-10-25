import TerritorySyncStatus from '@features/territories/components/sync_status';
import { Box } from '@mui/material';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import PageTitle from '@components/page_title';
import TerritoryDoNotCalls from '@features/territories/do_not_calls';
import useParentPage from '@features/territories/useParentPage';

const DoNotCallsPage = () => {
  const { t } = useAppTranslation();

  const { parent, goBack } = useParentPage('tr_territories', '/');
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
        title={t('tr_territoryDoNotCallLabel')}
        secondaryTitle={parent}
        onBack={goBack}
      />
      <TerritorySyncStatus />

      <TerritoryDoNotCalls />
    </Box>
  );
};

export default DoNotCallsPage;
