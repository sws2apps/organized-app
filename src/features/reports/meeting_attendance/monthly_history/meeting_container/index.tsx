import { Stack } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import { MeetingContainerProps } from './index.types';
import useMeetingContainer from './useMeetingContainer';
import DetailsRow from '../details_row';
import Divider from '@components/divider';
import Typography from '@components/typography';

const MeetingContainer = ({ meeting, month }: MeetingContainerProps) => {
  const { t } = useAppTranslation();

  const { labels } = useMeetingContainer();

  return (
    <Stack spacing="8px" borderRadius="var(--radius-l)" flex={1}>
      <Typography className="h3">
        {meeting === 'midweek'
          ? t('tr_midweekMeeting')
          : t('tr_weekendMeeting')}
      </Typography>

      <Stack divider={<Divider color="var(--accent-200)" />}>
        {labels.map((record) => (
          <DetailsRow
            key={record}
            type={record}
            month={month}
            meeting={meeting}
          />
        ))}
      </Stack>
    </Stack>
  );
};

export default MeetingContainer;
