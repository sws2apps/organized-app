import { Stack } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import { FulltimeServantsProps } from './index.types';
import useFulltimeServants from './useFulltimeServants';
import Divider from '@components/divider';
import SectionTitle from '../section_title';
import StatsRow from '@features/reports/stats_row';

const FulltimeServants = (props: FulltimeServantsProps) => {
  const { t } = useAppTranslation();

  const { reports } = useFulltimeServants(props);

  return (
    <Stack spacing="8px">
      <SectionTitle>{t('tr_fulltimeServants')}</SectionTitle>

      <Stack divider={<Divider color="var(--accent-200)" />}>
        {reports.map((report) => (
          <StatsRow
            key={report.label}
            title={report.label}
            value={report.value}
            color="var(--grey-400)"
            colorValue
            sx={{ padding: '8px' }}
          />
        ))}
      </Stack>
    </Stack>
  );
};

export default FulltimeServants;
