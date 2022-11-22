import { useCallback, useEffect, useRef } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Typography from '@mui/material/Typography';
import { dbBuildScheduleForShare } from '../../indexedDb/dbSchedule';
import { appMessageState, appSeverityState, appSnackOpenState } from '../../states/notification';
import { currentScheduleState, isPublishOpenState } from '../../states/schedule';
import { apiHostState, userEmailState, visitorIDState } from '../../states/main';
import { congIDState } from '../../states/congregation';

const SchedulePublish = () => {
  const { t } = useTranslation();

  const cancel = useRef();

  const [open, setOpen] = useRecoilState(isPublishOpenState);

  const setAppSnackOpen = useSetRecoilState(appSnackOpenState);
  const setAppSeverity = useSetRecoilState(appSeverityState);
  const setAppMessage = useSetRecoilState(appMessageState);

  const visitorID = useRecoilValue(visitorIDState);
  const userEmail = useRecoilValue(userEmailState);
  const apiHost = useRecoilValue(apiHostState);
  const currentSchedule = useRecoilValue(currentScheduleState);
  const congID = useRecoilValue(congIDState);

  const handleClose = useCallback(
    (event, reason) => {
      if (reason === 'clickaway' || reason === 'backdropClick') {
        return;
      }
      setOpen(false);
    },
    [setOpen]
  );

  const publishSchedulePocket = useCallback(async () => {
    try {
      cancel.current = false;

      const dataPocket = await dbBuildScheduleForShare(currentSchedule.value);
      const { cong_schedule, cong_sourceMaterial } = dataPocket;

      if (apiHost !== '') {
        const res = await fetch(`${apiHost}api/congregations/${congID}/schedule`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            visitorid: visitorID,
            email: userEmail,
          },
          body: JSON.stringify({ cong_schedule, cong_sourceMaterial }),
        });

        if (!cancel.current) {
          const data = await res.json();

          if (res.status === 200) {
            setAppMessage(t('schedule.publishSuccess'));
            setAppSeverity('success');
            setAppSnackOpen(true);
            handleClose(false);

            return;
          }

          setAppMessage(data.message);
          setAppSeverity('warning');
          setAppSnackOpen(true);
          handleClose(false);
        }
      }
    } catch (err) {
      if (!cancel.current) {
        setAppMessage(err.message);
        setAppSeverity('error');
        setAppSnackOpen(true);
        handleClose();
      }
    }
  }, [
    cancel,
    apiHost,
    congID,
    currentSchedule,
    handleClose,
    setAppMessage,
    setAppSeverity,
    setAppSnackOpen,
    t,
    userEmail,
    visitorID,
  ]);

  useEffect(() => {
    publishSchedulePocket();
  }, [publishSchedulePocket]);

  useEffect(() => {
    return () => {
      cancel.current = true;
    };
  }, []);

  return (
    <Box>
      <Dialog open={open} aria-labelledby="dialog-title-publish" onClose={handleClose}>
        <DialogContent>
          <CircularProgress
            color="secondary"
            size={80}
            disableShrink={true}
            sx={{
              display: 'flex',
              margin: '30px auto',
            }}
          />
          <Typography>{t('schedule.publishPocket')}</Typography>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default SchedulePublish;
