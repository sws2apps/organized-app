import { useCallback, useEffect } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { usePDF } from '@react-pdf/renderer';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { S89 } from '../../views';
import { S89DownloadLoadingState, S89DownloadOpenState, s89DataState } from '../../states/schedule';

const Download = ({ s89Data }) => {
  const setOpen = useSetRecoilState(S89DownloadOpenState);
  const setisLoading = useSetRecoilState(S89DownloadLoadingState);

  const [instance, update] = usePDF({
    document: <S89 s89Data={s89Data} />,
  });

  const handleRerenderPDF = useCallback(async () => {
    await update();
    if (instance.url) {
      const link = document.createElement('a');
      link.download = 'S-89';
      link.href = instance.url;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    setOpen(false);
  }, [update, instance.url, setOpen]);

  useEffect(() => {
    setisLoading(instance.loading);
  }, [instance.loading, setisLoading]);

  useEffect(() => {
    const updatePDF = setTimeout(async () => {
      handleRerenderPDF();
    }, 3000);

    return () => {
      clearTimeout(updatePDF);
    };
  }, [handleRerenderPDF]);

  return <></>;
};

const S89DownloadPDF = () => {
  const [open, setOpen] = useRecoilState(S89DownloadOpenState);

  const s89Data = useRecoilValue(s89DataState);
  const isLoading = useRecoilValue(S89DownloadLoadingState);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway' || reason === 'backdropClick') {
      return;
    }
    setOpen(false);
  };

  return (
    <Box>
      {isLoading && (
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
      )}
      {s89Data.length > 0 && <Download s89Data={s89Data} />}
    </Box>
  );
};

export default S89DownloadPDF;
