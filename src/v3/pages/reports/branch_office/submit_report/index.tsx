import { Box } from '@mui/material';
import Button from '@components/button';
import Dialog from '@components/dialog';
import Typography from '@components/typography';
import { useAppTranslation } from '@hooks/index';
import useSubmitReport from './useSubmitReport';
import { SubmitReportType } from './index.types';

const SubmitReport = ({ open, onClose, onSubmit, header, body }: SubmitReportType) => {
  const { t } = useAppTranslation();

  const { handleSubmit } = useSubmitReport();

  return (
    <Dialog onClose={onClose} open={open}>
      <Typography className="h2">{header}</Typography>
      <Typography className="body-regular" color="var(--grey-400)">
        {body}
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
        <Button
          variant="main"
          onClick={() => {
            handleSubmit();
            onSubmit();
          }}
        >
          {t('tr_markAsSubmitted')}
        </Button>
        <Button variant="secondary" onClick={onClose}>
          {t('tr_cancel')}
        </Button>
      </Box>
    </Dialog>
  );
};

export default SubmitReport;
