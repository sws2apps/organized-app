import { Box } from '@mui/material';
import { IconGenerate, IconPrint, IconPublish } from '@components/icons';
import { ScheduleAutofillDialog, WeekSelector } from '@features/index';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import useWeekend from './useWeekend';
import Button from '@components/button';
import PageTitle from '@components/page_title';
import WeekendEditor from '@features/meetings/weekend_editor';

const WeekendMeeting = () => {
  const { t } = useAppTranslation();

  const { desktopUp } = useBreakpoints();

  const { hasWeeks, openAutofill, handleCloseAutofill, handleOpenAutofill } =
    useWeekend();

  return (
    <Box
      sx={{
        display: 'flex',
        gap: '16px',
        flexDirection: 'column',
      }}
    >
      {openAutofill && (
        <ScheduleAutofillDialog
          meeting="weekend"
          open={openAutofill}
          onClose={handleCloseAutofill}
        />
      )}

      <PageTitle
        title={t('tr_weekendMeeting')}
        buttons={
          hasWeeks && (
            <>
              <Button variant="secondary" startIcon={<IconPrint />}>
                {t('tr_export')}
              </Button>
              <Button
                variant="secondary"
                startIcon={<IconGenerate />}
                onClick={handleOpenAutofill}
              >
                {t('tr_autofill')}
              </Button>
              <Button variant="main" startIcon={<IconPublish />}>
                {t('tr_publish')}
              </Button>
            </>
          )
        }
      />

      <Box
        sx={{
          display: 'flex',
          flexDirection: desktopUp ? 'row' : 'column',
          gap: '16px',
          alignItems: desktopUp ? 'flex-start' : 'unset',
        }}
      >
        <WeekSelector />
        <WeekendEditor />
      </Box>
    </Box>
  );
};

export default WeekendMeeting;
