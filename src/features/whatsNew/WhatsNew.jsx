import { useRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Typography from '@mui/material/Typography';
import WhatsNewDetail from './WhatsNewDetail';
import { currentNotificationState, isWhatsNewOpenState } from '../../states/main';

const WhatsNew = () => {
  const { t } = useTranslation('ui');

  const [isOpen, setIsOpen] = useRecoilState(isWhatsNewOpenState);
  const [item, setItem] = useRecoilState(currentNotificationState);

  const handleClose = () => {
    setIsOpen(false);
    setItem({});
  };

  return (
    <Box>
      <Dialog open={isOpen} aria-labelledby="dialog-title-announcement-edit" onClose={handleClose}>
        <DialogTitle id="dialog-title-announcement-edit">
          <Typography variant="h6" component="p" sx={{ borderBottom: '1px outset' }}>
            {t('whatsNew')}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <WhatsNewDetail announcement={item} />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default WhatsNew;
