import { useCallback, useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { useTranslation } from 'react-i18next';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { S1s } from '../../classes/S1s';
import { ServiceYear } from '../../classes/ServiceYear';
import { Setting } from '../../classes/Setting';
import { roleReloadState } from '../../states/main';

const AppReminder = () => {
  const { t } = useTranslation('ui');
  const [hasReminder, setHasReminder] = useState(false);
  const [lateS1, setLateS1] = useState(false);

  const roleReload = useRecoilValue(roleReloadState);

  const checkCurrentReport = useCallback(async () => {
    await Setting.load();

    const secretaryRole = Setting.cong_role.includes('secretary');

    if (secretaryRole) {
      const date = new Date().getDate();

      if (date <= 20) {
        const currentMonth = ServiceYear.currentReportMonth();
        const currentS1 = S1s.get(currentMonth);

        if (!currentS1) {
          setHasReminder(true);
          setLateS1(true);
          return;
        }

        const isS1Submitted = currentS1.details.isSubmitted;
        if (!isS1Submitted) {
          setHasReminder(true);
          setLateS1(true);
        }
      }
    }
  }, []);

  useEffect(() => {
    const checkReminders = setTimeout(() => {
      checkCurrentReport();
    }, 3000);

    return () => {
      clearTimeout(checkReminders);
    };
  }, [checkCurrentReport]);

  useEffect(() => {}, [roleReload]);

  return (
    <>
      {hasReminder && (
        <Box sx={{ marginBottom: '15px' }}>
          <Alert severity="warning" variant="outlined">
            <AlertTitle>{t('reminders')}</AlertTitle>
            <List dense={true} sx={{ padding: 0 }}>
              {lateS1 && (
                <ListItem sx={{ padding: 0 }}>
                  <ListItemText primary={t('reminderS1Report')} />
                </ListItem>
              )}
            </List>
          </Alert>
        </Box>
      )}
    </>
  );
};

export default AppReminder;
