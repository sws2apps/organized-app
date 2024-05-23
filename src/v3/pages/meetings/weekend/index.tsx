import { Box } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import PageTitle from '@components/page_title';

const WeekendMeeting = () => {
  const { t } = useAppTranslation();

  return (
    <Box sx={{ display: 'flex', gap: '16px', flexDirection: 'column' }}>
      <PageTitle title={t('tr_planWeekendMeeting')} />
    </Box>
  );
};

export default WeekendMeeting;
