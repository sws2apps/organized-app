import { Box } from '@mui/material';
import { IconInfo } from '@components/icons';
import InfoTip from '@components/info_tip';
import { useAppTranslation } from '@hooks/index';
import MeetingItem from './meeting_item';
import { FieldServiceMeetingFormattedType } from '@definition/field_service_meetings';

export type FieldServiceMeetingsListProps = {
  meetings: FieldServiceMeetingFormattedType[];
  isAdding?: boolean;
};

const FieldServiceMeetingsList = ({
  meetings,
  isAdding,
}: FieldServiceMeetingsListProps) => {
  const { t } = useAppTranslation();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {!isAdding && meetings.length === 0 && (
        <InfoTip
          isBig={false}
          icon={<IconInfo />}
          color="blue"
          text={t('tr_noFieldServiceMeetings')}
        />
      )}
      {meetings.length > 0 &&
        meetings.map((meeting) => (
          <MeetingItem key={meeting.uid} meeting={meeting} />
        ))}
    </Box>
  );
};

export default FieldServiceMeetingsList;
