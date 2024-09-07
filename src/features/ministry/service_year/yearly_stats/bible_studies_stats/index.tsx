import { Stack } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import { BibleStudiesStatsProps } from './index.types';
import useBibleStudiesStats from './useBibleStudiesStats';
import Divider from '@components/divider';
import LabelRow from '../label_row';

const BibleStudiesStats = ({ year }: BibleStudiesStatsProps) => {
  const { t } = useAppTranslation();

  const { bible_studies } = useBibleStudiesStats(year);

  return (
    <Stack
      spacing="8px"
      divider={<Divider dashed color="var(--accent-200)" />}
      padding="8px 0"
    >
      <LabelRow
        name={t('tr_averageMonthlyBibleStudies')}
        value={bible_studies.average}
      />
      <LabelRow
        name={t('tr_maximumMonthlyBibleStudies')}
        value={bible_studies.peak}
      />
    </Stack>
  );
};

export default BibleStudiesStats;
