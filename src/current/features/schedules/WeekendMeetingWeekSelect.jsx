import { useEffect, useMemo, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import dateFormat from 'dateformat';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Schedules } from '../../classes/Schedules';
import { Setting } from '../../classes/Setting';
import { appMessageState, appSeverityState, appSnackOpenState } from '../../states/notification';
import { weekendMeetingAutofill, weekendMeetingDelete } from '../../utils/schedule';
import { weekendMeetingDownloadOpenState, weekendMeetingDataState } from '../../states/schedule';
import { refreshScreenState } from '../../states/main';

const WeekendMeetingWeekSelect = ({ actionType, open, setOpen }) => {
  const { t } = useTranslation('ui');

  const setAppSnackOpen = useSetRecoilState(appSnackOpenState);
  const setAppSeverity = useSetRecoilState(appSeverityState);
  const setAppMessage = useSetRecoilState(appMessageState);
  const setRefreshSchedule = useSetRecoilState(refreshScreenState);
  const setIsWeekendMeetingDownload = useSetRecoilState(weekendMeetingDownloadOpenState);
  const setWeekendMeetingData = useSetRecoilState(weekendMeetingDataState);

  const [isProcessing, setIsProcessing] = useState(false);
  const [startWeek, setStartWeek] = useState('');
  const [endWeek, setEndWeek] = useState('');
  const [endWeekOptions, setEndWeekOptions] = useState([]);

  const schedules = useMemo(
    () =>
      Schedules.list
        .filter((record) => {
          const startDate = new Date(2023, 5, 6);
          const tmp = record.weekOf.split('/');
          const recordDate = new Date(tmp[0], +tmp[1] - 1, tmp[2]);

          return recordDate >= startDate;
        })
        .sort((a, b) => {
          return a.weekOf > b.weekOf ? 1 : -1;
        }),
    []
  );

  const getActionTitle = () => {
    let title = '';

    if (actionType === 'autofill') title = t('autofill');
    if (actionType === 'delete') title = t('delete');
    if (actionType === 'export') title = t('export');

    return title;
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway' || reason === 'backdropClick') {
      return;
    }
    setOpen(false);
  };

  const handleRunAction = async () => {
    try {
      setIsProcessing(true);

      if (actionType === 'export') {
        const weeks = Schedules.WeekendMeetingData(startWeek, endWeek);
        setWeekendMeetingData(weeks);
        setIsProcessing(false);
        setOpen(false);
        setIsWeekendMeetingDownload(true);
        return;
      }

      if (actionType === 'autofill') await weekendMeetingAutofill(startWeek, endWeek);

      if (actionType === 'delete') await weekendMeetingDelete(startWeek, endWeek);

      setRefreshSchedule((prev) => !prev);
      setIsProcessing(false);
      setOpen(false);
    } catch (err) {
      setIsProcessing(false);
      setAppMessage(err.message);
      setAppSeverity('error');
      setAppSnackOpen(true);
      setOpen(false);
    }
  };

  useEffect(() => {
    if (startWeek === '') {
      setEndWeekOptions([]);
    }

    if (startWeek !== '') {
      setEndWeekOptions(
        schedules.filter((record) => {
          const tmpStart = startWeek.split('/');
          const startDate = new Date(tmpStart[0], +tmpStart[1] - 1, tmpStart[2]);
          const tmpEnd = record.weekOf.split('/');
          const recordDate = new Date(tmpEnd[0], +tmpEnd[1] - 1, tmpEnd[2]);

          return recordDate >= startDate;
        })
      );
    }
  }, [startWeek, schedules]);

  return (
    <Box>
      <Dialog open={open} aria-labelledby="dialog-title-autofill-assignment" onClose={handleClose}>
        <DialogTitle id="dialog-title-autofill-assignment">
          <Typography variant="h6" component="p" sx={{ lineHeight: 1.2 }}>
            {`${t('weekendMeeting')} | ${getActionTitle()}`}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ marginTop: '10px' }}>
            {isProcessing && (
              <CircularProgress
                color="secondary"
                size={80}
                disableShrink={true}
                sx={{ display: 'flex', margin: '10px auto' }}
              />
            )}
            {!isProcessing && (
              <Box sx={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                <TextField
                  id="outlined-select-start-week"
                  select
                  label={t('startLabel')}
                  size="small"
                  sx={{ width: '180px' }}
                  value={startWeek}
                  onChange={(e) => setStartWeek(e.target.value)}
                >
                  {schedules.map((schedule) => (
                    <MenuItem key={`start-${schedule.weekOf}`} value={schedule.weekOf}>
                      {dateFormat(schedule.weekOf, Setting.shortDateFormat())}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  id="outlined-select-end-week"
                  select
                  label={t('endLabel')}
                  size="small"
                  sx={{ width: '180px' }}
                  value={endWeek}
                  onChange={(e) => setEndWeek(e.target.value)}
                >
                  {endWeekOptions.map((schedule) => (
                    <MenuItem key={`start-${schedule.weekOf}`} value={schedule.weekOf}>
                      {dateFormat(schedule.weekOf, Setting.shortDateFormat())}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" autoFocus disabled={isProcessing}>
            {t('cancel')}
          </Button>
          <Button
            autoFocus
            onClick={handleRunAction}
            color="primary"
            disabled={isProcessing || startWeek === '' || endWeek === ''}
          >
            {t('continueLabel')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default WeekendMeetingWeekSelect;
