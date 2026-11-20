import { useState } from 'react';
import { useAtomValue } from 'jotai';
import { Box } from '@mui/material';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import { congAccountConnectedState } from '@states/app';
import { IconGenerate, IconPublish } from '@components/icons';
import CleaningEditor from '@features/activities/hall_cleaning/cleaning_editor';
import NavBarButton from '@components/nav_bar_button';
import NavBarButtonGroup from '@components/nav_bar_button_group';
import PageTitle from '@components/page_title';
import QuickSettingsHallCleaning from '@features/activities/hall_cleaning/quick_settings';
import ScheduleAutofillDialog from '@features/meetings/schedule_autofill';
import SchedulePublish from '@features/meetings/schedule_publish';
import WeekSelector from '@features/meetings/week_selector';

const HallCleaning = () => {
  const { t } = useAppTranslation();

  const { desktopUp } = useBreakpoints();

  const isConnected = useAtomValue(congAccountConnectedState);

  const [quickSettingsOpen, setQuickSettingsOpen] = useState(false);
  const [autofillOpen, setAutofillOpen] = useState(false);
  const [publishOpen, setPublishOpen] = useState(false);

  return (
    <Box sx={{ display: 'flex', gap: '16px', flexDirection: 'column' }}>
      {quickSettingsOpen && (
        <QuickSettingsHallCleaning
          open={quickSettingsOpen}
          onClose={() => setQuickSettingsOpen(false)}
        />
      )}

      {autofillOpen && (
        <ScheduleAutofillDialog
          meeting="cleaning"
          open={autofillOpen}
          onClose={() => setAutofillOpen(false)}
        />
      )}

      {isConnected && publishOpen && (
        <SchedulePublish
          type="cleaning"
          open={publishOpen}
          onClose={() => setPublishOpen(false)}
        />
      )}

      <PageTitle
        title={t('tr_hallCleaning')}
        quickSettings={() => setQuickSettingsOpen(true)}
        buttons={
          <NavBarButtonGroup>
            <NavBarButton
              text={t('tr_autofill')}
              icon={<IconGenerate />}
              onClick={() => setAutofillOpen(true)}
            />
            {isConnected && (
              <NavBarButton
                text={t('tr_publish')}
                icon={<IconPublish />}
                onClick={() => setPublishOpen(true)}
              />
            )}
          </NavBarButtonGroup>
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
        <CleaningEditor />
      </Box>
    </Box>
  );
};

export default HallCleaning;
