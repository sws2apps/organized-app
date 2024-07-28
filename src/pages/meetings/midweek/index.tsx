import { Box } from '@mui/material';
import { IconGenerate, IconPrint, IconPublish } from '@components/icons';
import {
  MidweekExport,
  ScheduleAutofillDialog,
  WeekSelector,
} from '@features/index';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import useMidweek from './useMidweek';
import Button from '@components/button';
import MidweekEditor from '@features/meetings/midweek_editor';
import PageTitle from '@components/page_title';

const MidweekMeeting = () => {
  const { t } = useAppTranslation();

  const { desktopUp } = useBreakpoints();

  const {
    hasWeeks,
    handleCloseAutofill,
    handleOpenAutofill,
    openAutofill,
    handleCloseExport,
    handleOpenExport,
    openExport,
  } = useMidweek();

  return (
    <Box
      sx={{
        display: 'flex',
        gap: '16px',
        flexDirection: 'column',
      }}
    >
      {openExport && (
        <MidweekExport open={openExport} onClose={handleCloseExport} />
      )}

      {openAutofill && (
        <ScheduleAutofillDialog
          meeting="midweek"
          open={openAutofill}
          onClose={handleCloseAutofill}
        />
      )}

      <PageTitle
        title={t('tr_midweekMeeting')}
        buttons={
          hasWeeks && (
            <>
              <Button
                variant="secondary"
                onClick={handleOpenExport}
                startIcon={<IconPrint />}
              >
                {t('tr_export')}
              </Button>
              <Button
                variant="secondary"
                onClick={handleOpenAutofill}
                startIcon={<IconGenerate />}
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
        <MidweekEditor />
      </Box>
    </Box>
  );
};

export default MidweekMeeting;
