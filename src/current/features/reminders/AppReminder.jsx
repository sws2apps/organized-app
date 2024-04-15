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
import { congRoleState } from '../../states/congregation';
import { UserS4MonthlyReport } from '../../classes/UserS4MonthlyReport';

const AppReminder = () => {
  const { t } = useTranslation('ui');
  const [hasReminder, setHasReminder] = useState(false);
  const [lateS1, setLateS1] = useState(false);
  const [lateS4, setLateS4] = useState(false);

  const congRole = useRecoilValue(congRoleState);

  const checkCurrentReport = useCallback(async () => {
    await Setting.load();

    const secretaryRole = congRole.includes('secretary');
    const publisherRole = congRole.includes('elder') || congRole.includes('ms') || congRole.includes('publisher');

    const currentMonth = ServiceYear.currentReportMonth();
    const date = new Date().getDate();

    if (secretaryRole) {
      if (date <= 20) {
        const currentS1 = S1s.get(currentMonth);

        if (!currentS1) {
          setHasReminder(true);
          setLateS1(true);
        }

        if (currentS1) {
          const isS1Submitted = currentS1.details.isSubmitted;
          if (!isS1Submitted) {
            setHasReminder(true);
            setLateS1(true);
          }
        }
      }
    }

    if (publisherRole) {
      if (date >= 2 && date < 20) {
        const currentS4 = await UserS4MonthlyReport.get(currentMonth);
        const isS1Submitted = currentS4.isSubmitted;
        if (!isS1Submitted) {
          setHasReminder(true);
          setLateS4(true);
        }
      }
    }
  }, [congRole]);

  useEffect(() => {
    const checkReminders = setTimeout(() => {
      checkCurrentReport();
    }, 3000);

    return () => {
      clearTimeout(checkReminders);
    };
  }, [checkCurrentReport]);

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
              {lateS4 && (
                <ListItem sx={{ padding: 0 }}>
                  <ListItemText primary={t('reminderS4Report')} />
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
