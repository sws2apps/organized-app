import { Box } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import useScheduleHeader from './useScheduleHeader';
import Badge from '@components/badge';
import InfoNote from '@components/info_note';

const ScheduleHeader = () => {
  const { t } = useAppTranslation();

  const { scheduleLastUpdated } = useScheduleHeader();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: '16px',
        marginBottom: '8px',
      }}
    >
      <InfoNote message={t('tr_infoOutgoingTalk')} />
      <Badge
        text={t('tr_lastUpdated', { date: scheduleLastUpdated })}
        color="grey"
        size="small"
        filled={false}
      />
    </Box>
  );
};

export default ScheduleHeader;
