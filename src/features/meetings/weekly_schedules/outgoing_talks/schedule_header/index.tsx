import { Box } from '@mui/material';
import { IconInfo } from '@components/icons';
import { useAppTranslation } from '@hooks/index';
import useScheduleHeader from './useScheduleHeader';
import Badge from '@components/badge';
import Typography from '@components/typography';

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
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <IconInfo color="var(--grey-350)" />
        <Typography color="var(--grey-350)">
          {t('tr_infoOutgoingTalk')}
        </Typography>
      </Box>
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
