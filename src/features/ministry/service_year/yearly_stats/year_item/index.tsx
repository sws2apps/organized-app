import { Stack } from '@mui/material';
import { YearlyItemProps } from './index.types';
import useYearItem from './useYearItem';
import BibleStudiesStats from '../bible_studies_stats';
import Divider from '@components/divider';
import HoursStats from '../hours_stats';
import PioneerStats from '../pioneer_stats';

const YearlItem = ({ year }: YearlyItemProps) => {
  const { hours, hoursEnabled, isFR, isFS, isInfirm } = useYearItem(year);

  // Show pioneer stats panel for:
  // - All FR (regular) pioneers (always has a yearly goal)
  // - FS (special) pioneers who are marked infirm (to show the "no goal" notice)
  const showPioneerStats = isFR || (isFS && isInfirm);

  return (
    <Stack
      marginTop="-16px !important"
      marginBottom="-40px !important"
      borderTop="1px solid var(--accent-200)"
      padding="16px 0"
      spacing="8px"
      divider={<Divider color="var(--accent-200)" />}
    >
      {(hours.total > 0 || hoursEnabled) && <HoursStats year={year} />}

      <BibleStudiesStats year={year} />

      {showPioneerStats && <PioneerStats year={year} />}
    </Stack>
  );
};

export default YearlItem;

