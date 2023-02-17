import { useState } from 'react';
import { useSetRecoilState, useRecoilState, useRecoilValue } from 'recoil';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import {
  userConfirmationActionState,
  userConfirmationMessageState,
  userConfirmationOpenState,
  userConfirmationTitleState,
} from '../states/main';
import { dbAddManualSource, dbDeleteWeek } from '../indexedDb/dbSourceMaterial';
import { appMessageState, appSeverityState, appSnackOpenState } from '../states/notification';
import { refreshWeeksListState } from '../states/sourceMaterial';

const UserConfirmation = () => {
  const { t } = useTranslation('ui');

  const [open, setOpen] = useRecoilState(userConfirmationOpenState);

  const setAppSnackOpen = useSetRecoilState(appSnackOpenState);
  const setAppSeverity = useSetRecoilState(appSeverityState);
  const setAppMessage = useSetRecoilState(appMessageState);
  const setRefreshWeeksList = useSetRecoilState(refreshWeeksListState);

  const title = useRecoilValue(userConfirmationTitleState);
  const message = useRecoilValue(userConfirmationMessageState);
  const action = useRecoilValue(userConfirmationActionState);

  const [isProcessing, setIsProcessing] = useState(false);

  const handleWeekAddConfirm = async () => {
    setIsProcessing(true);
    await dbAddManualSource();
    setAppSnackOpen(true);
    setAppSeverity('success');
    setAppMessage(t('weekAdded'));
    setIsProcessing(false);
    setOpen(false);
  };

  const handleWeekDeleteConfirm = async () => {
    setIsProcessing(true);
    const week = action.split('-')[1];

    await dbDeleteWeek(week);
    setAppSnackOpen(true);
    setAppSeverity('success');
    setAppMessage(t('weekDeletedSuccess'));
    setRefreshWeeksList((prev) => {
      return !prev;
    });
    setIsProcessing(false);
    setOpen(false);
  };

  const handleConfirm = async () => {
    if (action === 'manualWeekAdd') await handleWeekAddConfirm();
    if (action.indexOf('weekDelete-') !== -1) await handleWeekDeleteConfirm();
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-close-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-close-title">{title}</DialogTitle>
        <DialogContent>
          <Typography>{message}</Typography>
        </DialogContent>
        <DialogActions>
          <Button disabled={isProcessing} onClick={handleClose}>
            {t('no')}
          </Button>
          <Button
            disabled={isProcessing}
            onClick={handleConfirm}
            endIcon={isProcessing ? <CircularProgress size={25} /> : null}
          >
            {t('yes')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserConfirmation;
