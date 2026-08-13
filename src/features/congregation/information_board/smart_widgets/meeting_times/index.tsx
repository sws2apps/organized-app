import { useAppTranslation } from '@hooks/index';
import IBAnnouncementCard from '../../announcement_card';
import { Stack } from '@mui/material';
import { IconDiamond, IconTalk } from '@components/icons';
import useSWMeetingTimes from './useMeetingTimes';
import CopyField from '@components/copy_field';

const SWMeetingTimes = () => {
  const { t } = useAppTranslation();
  const {
    midweekMeetingDay,
    midweekMeetingTime,
    weekendMeetingDay,
    weekendMeetingTime,
    lastUpdated,
  } = useSWMeetingTimes();

  return (
    <IBAnnouncementCard
      title={t('tr_meetingTimes')}
      pinned={false}
      date={lastUpdated}
      content={
        <Stack spacing={'8px'}>
          <CopyField
            icon={<IconDiamond color="var(--black)" />}
            label={midweekMeetingDay}
            value={midweekMeetingTime}
          />
          <CopyField
            icon={<IconTalk color="var(--black)" />}
            label={weekendMeetingDay}
            value={weekendMeetingTime}
          />
        </Stack>
      }
    />
  );
};
export default SWMeetingTimes;
