import { Box, Collapse, Stack } from '@mui/material';
import { SelectorStatsProps } from './index.types';
import useSelectorStats from './useSelectorStats';
import Card from '@components/card';
import Divider from '@components/divider';
import ReceivedReports from './received_reports';
import ServiceYearMonthSelector from '@features/reports/service_year_month_selector';
import PersonFilter from './person_filter';
import { IconInfo } from '@components/icons';
import Typography from '@components/typography';
import { t } from 'i18next';

const SelectorStats = ({ hideStats = false }: SelectorStatsProps) => {
  const { handleMonthChange, handleYearChange, month, year, month_locked } =
    useSelectorStats();

  return (
    <Card>
      <Stack>
        <Stack spacing="24px">
          <ServiceYearMonthSelector
            year={year}
            month={month || ''}
            onYearChange={handleYearChange}
            onMonthChange={handleMonthChange}
          />

          {month_locked && (
            <Box
              sx={{
                borderRadius: 'var(--radius-xl)',
                padding: '16px',
                backgroundColor: 'var(--orange-secondary)',
                display: 'flex',
                gap: '8px',
                alignItems: 'center',
              }}
            >
              <IconInfo color="var(--orange-dark)" />
              <Typography color="var(--orange-dark)">
                {t('tr_alreadySubmittedWarning')}
              </Typography>
            </Box>
          )}
        </Stack>

        <Collapse in={!hideStats}>
          <Stack spacing="24px" sx={{ paddingTop: '24px' }}>
            <Divider color="var(--accent-200)" />
            <ReceivedReports />
            <PersonFilter />
          </Stack>
        </Collapse>
      </Stack>
    </Card>
  );
};

export default SelectorStats;
