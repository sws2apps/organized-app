import { useCallback, useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { usePDF } from '@react-pdf/renderer';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { S89 } from '../../views';
import { S89DownloadLoadingState, S89DownloadOpenState, s89DataState } from '../../states/schedule';

const S89DownloadPDF = () => {
  const [open, setOpen] = useRecoilState(S89DownloadOpenState);

  const s89Data = useRecoilValue(s89DataState);
  const isLoading = useRecoilValue(S89DownloadLoadingState);

  const [instance, update] = usePDF({
    document: <S89 s89Data={s89Data} />,
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
      link.download = 'S-89';
      link.href = instance.url;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setOpen(false);
    }
  }, [update, instance.url, setOpen]);

  useEffect(() => {
    const updatePDF = setTimeout(async () => {
      if (!isLoading) await handleRerenderPDF();
    }, 3000);

    return () => {
      clearTimeout(updatePDF);
    };
  }, [isLoading, handleRerenderPDF]);

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

export default S89DownloadPDF;
