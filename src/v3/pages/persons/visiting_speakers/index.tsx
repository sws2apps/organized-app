import { Box } from '@mui/material';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import { Button, PageTitle } from '@components/index';
import { IconAdd } from '@components/icons';
import { IncomingSpeakers, OutgoingSpeakers } from '@features/index';

const VisitingSpeakers = () => {
  const { t } = useAppTranslation();

  const { desktopUp } = useBreakpoints();

  return (
    <Box sx={{ display: 'flex', gap: '16px', flexDirection: 'column' }}>
      <PageTitle
        title={t('tr_visitingSpeakers')}
        buttons={
          <Button variant="main" startIcon={<IconAdd />}>
            {t('tr_addCongregation')}
          </Button>
        }
      />

      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          flexDirection: desktopUp ? 'row' : 'column',
          gap: '16px',
          borderRadius: 'var(--radius-xl)',
        }}
      >
        <OutgoingSpeakers />
        <IncomingSpeakers />
      </Box>
    </Box>
  );
};

export default VisitingSpeakers;
