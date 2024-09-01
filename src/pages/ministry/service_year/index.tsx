import { Box, Stack } from '@mui/material';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import MonthlyStats from '@features/ministry/service_year/monthly_stats';
import PageTitle from '@components/page_title';
import YearlyStats from '@features/ministry/service_year/yearly_stats';

const ServiceYear = () => {
  const { t } = useAppTranslation();

  const { desktopUp } = useBreakpoints();

  return (
    <Stack spacing="16px">
      <PageTitle title={t('tr_serviceYear')} />

      <Box
        sx={{
          display: 'flex',
          gap: '16px',
          flexDirection: desktopUp ? 'row' : 'column',
          alignItems: desktopUp ? 'flex-start' : 'stretch',
          '& > .MuiBox-root': {
            width: desktopUp ? '50%' : '100%',
          },
        }}
      >
        <YearlyStats />
        <MonthlyStats />
      </Box>
    </Stack>
  );
};

export default ServiceYear;
