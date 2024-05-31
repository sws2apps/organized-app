import { Box } from '@mui/material';
import { IconGenerate, IconPrint, IconPublish } from '@components/icons';
import { WeekSelector } from '@features/index';
import { useAppTranslation } from '@hooks/index';
import useWeekend from './useWeekend';
import Button from '@components/button';
import PageTitle from '@components/page_title';

const WeekendMeeting = () => {
  const { t } = useAppTranslation();

  const { hasWeeks } = useWeekend();

  return (
    <Box
      sx={{
        display: 'flex',
        gap: '16px',
        flexDirection: 'column',
      }}
    >
      <PageTitle
        title={t('tr_weekendMeeting')}
        buttons={
          hasWeeks && (
            <>
              <Button variant="secondary" startIcon={<IconPrint />}>
                {t('tr_export')}
              </Button>
              <Button variant="secondary" startIcon={<IconGenerate />}>
                {t('tr_autofill')}
              </Button>
              <Button variant="main" startIcon={<IconPublish />}>
                {t('tr_publish')}
              </Button>
            </>
          )
        }
      />

      <WeekSelector />
    </Box>
  );
};

export default WeekendMeeting;
