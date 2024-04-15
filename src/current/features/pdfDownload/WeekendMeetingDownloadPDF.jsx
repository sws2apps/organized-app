import { useCallback, useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { usePDF } from '@react-pdf/renderer';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { WeekendMeetingTemplate } from '../../views';
import { weekendMeetingDownloadOpenState, weekendMeetingDataState } from '../../states/schedule';

const WeekendMeetingDownloadPDF = () => {
  const [open, setOpen] = useRecoilState(weekendMeetingDownloadOpenState);

  const weekendData = useRecoilValue(weekendMeetingDataState);

  const [instance, update] = usePDF({
    document: <WeekendMeetingTemplate data={weekendData} />,
  });

  const handleClose = (event, reason) => {
    if (reason === 'clickaway' || reason === 'backdropClick') {
      return;
    }
    setOpen(false);
  };

  const generateFilename = (data) => {
    const firstWeek = data[0];
    const lastWeek = data.at(-1);

    const firstSplit = firstWeek.weekend_meeting_date.split('/');
    const lastSplit = lastWeek.weekend_meeting_date.split('/');

    const firstFormatted = `${firstSplit[0]}${firstSplit[2]}`;
    const lastFormatted = `${lastSplit[0]}${lastSplit[2]}`;

    let formatted = firstFormatted;

    if (firstFormatted !== lastFormatted) {
      formatted += `_${lastFormatted}`;
    }

    return `WM_${formatted}`;
  };

  const handleRerenderPDF = useCallback(async () => {
    await update();

    if (instance.url) {
      const link = document.createElement('a');
      link.download = generateFilename(weekendData);
      link.href = instance.url;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setOpen(false);
    }
  }, [update, instance.url, setOpen, weekendData]);

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

export default WeekendMeetingDownloadPDF;
