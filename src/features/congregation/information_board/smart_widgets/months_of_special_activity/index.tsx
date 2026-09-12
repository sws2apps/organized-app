import { useAppTranslation } from '@hooks/index';
import IBAnnouncementCard from '../../announcement_card';
import useSWMonthsOfSpecialActivity from './useMonthsOfSpecialActivity';
import { Stack } from '@mui/material';

const SWMonthsOfSpecialActivity = () => {
  const { t } = useAppTranslation();

  const { specialMonths, latestUpdatedAt, noMonths } =
    useSWMonthsOfSpecialActivity();
  return (
    !noMonths && (
      <IBAnnouncementCard
        title={t('tr_monthsOfSpecialActivity')}
        pinned={false}
        date={latestUpdatedAt ? new Date(latestUpdatedAt) : undefined}
        content={<Stack spacing={'8px'}>{specialMonths}</Stack>}
      />
    )
  );
};
export default SWMonthsOfSpecialActivity;
