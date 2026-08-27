import { Collapse, Stack } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import { SelectorStatsProps } from './index.types';
import useSelectorStats from './useSelectorStats';
import Card from '@components/card';
import Divider from '@components/divider';
import InfoBanner from '@components/info_banner';
import PersonFilter from './person_filter';
import ReceivedReports from './received_reports';
import ServiceYearMonthSelector from '@features/reports/service_year_month_selector';

const SelectorStats = ({ hideStats = false }: SelectorStatsProps) => {
  const { t } = useAppTranslation();
  
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
            <InfoBanner>{t('tr_alreadySubmittedWarning')}</InfoBanner>
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
