import { useCallback, useEffect, useRef, useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import {
  dbBuildScheduleForShare,
  dbBuildSchedulesListForShare,
  formatSelectedSchedulesForShare,
} from '../../indexedDb/dbSchedule';
import { appMessageState, appSeverityState, appSnackOpenState } from '../../states/notification';
import { isPublishOpenState } from '../../states/schedule';
import { apiHostState, userEmailState, visitorIDState } from '../../states/main';
import { congIDState } from '../../states/congregation';
import TreeViewCheckbox from '../../components/TreeViewCheckbox';

const SchedulePublish = () => {
  const { t } = useTranslation();

  const abortCont = useRef();

  const [open, setOpen] = useRecoilState(isPublishOpenState);

  const setAppSnackOpen = useSetRecoilState(appSnackOpenState);
  const setAppSeverity = useSetRecoilState(appSeverityState);
  const setAppMessage = useSetRecoilState(appMessageState);

  const visitorID = useRecoilValue(visitorIDState);
  const userEmail = useRecoilValue(userEmailState);
  const apiHost = useRecoilValue(apiHostState);
  const congID = useRecoilValue(congIDState);

  const [data, setData] = useState({});
  const [selected, setSelected] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const handleClose = useCallback(
    (event, reason) => {
      if (reason === 'clickaway' || reason === 'backdropClick') {
        return;
      }
      setOpen(false);
    },
    [setOpen]
  );

  const handlePublishSchedule = async () => {
    try {
      const schedules = formatSelectedSchedulesForShare(selected);
      if (schedules.length === 0) {
        setAppMessage(t('schedule.selectSchedule'));
        setAppSeverity('warning');
        setAppSnackOpen(true);
        return;
      }

      let dataSchedules = [];
      for (const schedule of schedules) {
        const temp = await dbBuildScheduleForShare(schedule);
        dataSchedules.push(temp);
      }

      if (apiHost !== '') {
        setIsProcessing(true);
        abortCont.current = new AbortController();
        const res = await fetch(`${apiHost}api/congregations/${congID}/schedule`, {
          method: 'POST',
          signal: abortCont.current.signal,
          headers: {
            'Content-Type': 'application/json',
            visitorid: visitorID,
            email: userEmail,
          },
          body: JSON.stringify({ schedules: dataSchedules }),
        });

        const data = await res.json();

        if (res.status === 200) {
          setAppMessage(t('schedule.publishSuccess'));
          setAppSeverity('success');
          setAppSnackOpen(true);
          handleClose(false);
          setIsProcessing(false);
          return;
        }

        setAppMessage(data.message);
        setAppSeverity('warning');
        setAppSnackOpen(true);
        handleClose(false);
      }
    } catch (err) {
      if (!abortCont.current.signal.aborted) {
        setAppMessage(err.message);
        setAppSeverity('warning');
        setIsProcessing(false);
        setAppSnackOpen(true);
      }
    }
  };

  useEffect(() => {
    const getList = async () => {
      setIsLoading(true);
      const temp = await dbBuildSchedulesListForShare();
      setData(temp);
      setIsLoading(false);
    };

    getList();
  }, []);

  useEffect(() => {
    return () => {
      if (abortCont.current) abortCont.current.abort();
    };
  }, [abortCont]);

  return (
    <Box>
      <Dialog
        open={open}
        fullScreen={fullScreen}
        aria-labelledby="dialog-title-publish"
        onClose={handleClose}
        scroll="paper"
      >
        <DialogTitle id="alert-dialog-title" sx={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          {fullScreen && (
            <img
              src="./img/appLogo.png"
              alt="App Logo"
              style={{
                width: 'auto',
                height: '30px',
                borderRadius: '4px',
              }}
            />
          )}

          <Typography sx={{ lineHeight: 1.3, fontSize: fullScreen ? '16px' : '20px' }}>
            {t('schedule.publishPocket')}
          </Typography>
        </DialogTitle>
        <DialogContent dividers={true}>
          {isProcessing && (
            <Box sx={{ width: '340px', height: '210px' }}>
              <CircularProgress
                color="primary"
                size={80}
                disableShrink={true}
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  margin: 'auto',
                }}
              />
            </Box>
          )}
          {!isProcessing && (
            <Box>
              <Typography>{t('schedule.publishSelectSchedule')}</Typography>
              <Box sx={{ marginTop: '20px' }}>
                {!isLoading && Object.keys(data).length > 2 && data.children.length > 0 && (
                  <TreeViewCheckbox
                    data={data}
                    selected={selected}
                    setSelected={(value) => setSelected(value)}
                    defaultExpanded={['sched']}
                  />
                )}
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            {t('global.cancel')}
          </Button>
          <Button onClick={handlePublishSchedule} color="primary" autoFocus disabled={selected.length === 0}>
            {t('global.publish')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SchedulePublish;
