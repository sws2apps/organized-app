import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import { Markup } from 'interweave';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import { isAddSYOpenState } from '../../states/report';
import { ServiceYear } from '../../classes/ServiceYear';

const AddServiceYear = () => {
  const { t } = useTranslation('ui');

  const [isOpen, setIsOpen] = useRecoilState(isAddSYOpenState);
  const [isLoading, setIsLoading] = useState(true);
  const [canAdd, setCanAdd] = useState(false);
  const [serviceYear, setServiceYear] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleAddServiceYear = async () => {
    setIsProcessing(true);
    await ServiceYear.add(serviceYear.split('-')[0]);
    setIsProcessing(false);
    handleClose();
  };

  useEffect(() => {
    const checkPrevious = () => {
      const current = ServiceYear.getCurrent();
      const first = ServiceYear.first();
      const previous = `${first.value.split('-')[0] - 1}-${first.value.split('-')[0]}`;
      const isExpired = +previous.split('-')[0] < +current.value.split('-')[0] - 2;
      const isPreviousExist = ServiceYear.getByValue(previous);

      if (!isExpired && !isPreviousExist) {
        setServiceYear(previous);
      }

      setCanAdd(!isExpired);
      setIsLoading(false);
    };

    checkPrevious();
  }, []);

  return (
    <Box>
      <Dialog open={isOpen} onClose={handleClose} sx={{ maxWidth: '600px', margin: 'auto' }}>
        <DialogTitle>{t('addPreviousServiceYear')}</DialogTitle>
        <DialogContent dividers sx={{ padding: '10px 30px' }}>
          {isLoading && (
            <CircularProgress
              color="secondary"
              size={80}
              disableShrink={true}
              sx={{
                display: 'flex',
                margin: '10px auto',
              }}
            />
          )}
          {canAdd && (
            <Box>
              <Typography>
                <Markup content={t('addingPreviousServiceYearDesc', { serviceYear: serviceYear })} />
              </Typography>
            </Box>
          )}
          {!canAdd && (
            <Box>
              <Typography>{t('expiredServiceYear')}</Typography>
            </Box>
          )}
        </DialogContent>
        {canAdd && (
          <DialogActions>
            <Button onClick={handleClose}>{t('no')}</Button>
            <Button
              disabled={isProcessing}
              endIcon={isProcessing ? <CircularProgress size={25} /> : null}
              onClick={handleAddServiceYear}
            >
              {t('yes')}
            </Button>
          </DialogActions>
        )}
      </Dialog>
    </Box>
  );
};

export default AddServiceYear;
