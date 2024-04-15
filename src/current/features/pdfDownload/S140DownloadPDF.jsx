import { useCallback, useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { usePDF } from '@react-pdf/renderer';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { S140 } from '../../views';
import { S140DataState, S140DownloadOpenState, currentScheduleState } from '../../states/schedule';

const S140DownloadPDF = () => {
  const [open, setOpen] = useRecoilState(S140DownloadOpenState);

  const currentSchedule = useRecoilValue(currentScheduleState);
  const S140Data = useRecoilValue(S140DataState);

  const [instance, update] = usePDF({
    document: <S140 data={S140Data} currentSchedule={currentSchedule} />,
  });

  const handleClose = (event, reason) => {
    if (reason === 'clickaway' || reason === 'backdropClick') {
      return;
    }
    setOpen(false);
  };

  const handleRerenderPDF = useCallback(async () => {
    await update();
    if (instance.url) {
      const link = document.createElement('a');
      link.download = currentSchedule.value.replace('/', '-');
      link.href = instance.url;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setOpen(false);
    }
  }, [update, instance.url, setOpen, currentSchedule]);

  useEffect(() => {
    const updatePDF = setTimeout(() => {
      handleRerenderPDF();
    }, 3000);

    return () => {
      clearTimeout(updatePDF);
    };
  }, [handleRerenderPDF]);

  return (
    <Box>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-close-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent sx={{ padding: '50px' }}>
          <CircularProgress
            color="secondary"
            size={80}
            disableShrink={true}
            sx={{
              display: 'flex',
              margin: '0 auto',
            }}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default S140DownloadPDF;
