import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';

const CongregationRemoveAccess = ({ isDelete, setIsDelete, name, deleteUser }) => {
  const { t } = useTranslation();

  const handleClose = () => {
    setIsDelete(false);
  };

  return (
    <Box>
      <Dialog
        open={isDelete}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{t('administration.removeBrother')}</DialogTitle>
        <DialogContent>
          <Typography>{t('administration.removeBrotherDesc', { name: name })}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            {t('global.cancel')}
          </Button>
          <Button onClick={deleteUser} color="primary">
            {t('global.yes')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CongregationRemoveAccess;
