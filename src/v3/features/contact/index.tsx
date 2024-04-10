import { Box, IconButton } from '@mui/material';
import Button from '@components/button';
import Dialog from '@components/dialog';
import TextMarkup from '@components/text_markup';
import Typography from '@components/typography';
import { IconClose, IconMail } from '@icons/index';
import { useAppTranslation } from '@hooks/index';
import useContact from './useContact';
import CustomTextField from '@components/textfield';

const Contact = () => {
  const { handleClose, isOpen } = useContact();

  const { t } = useAppTranslation();

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: '8px', width: '100%' }}>
        <IconMail color="var(--black)" />
        <Box
          sx={{
            display: 'flex',
            padding: 'var(--radius-none)',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flex: '1 0 0',
          }}
        >
          <Typography className="h2">{t('tr_shareFeeback')}</Typography>
          <IconButton disableRipple sx={{ padding: 0, margin: 0 }} onClick={handleClose}>
            <IconClose color="var(--black)" />
          </IconButton>
        </Box>
      </Box>

      <TextMarkup content={t('tr_shareFeebackDesc')} className="body-regular" />
      <CustomTextField type="email" label={t('tr_yourEmailField')}></CustomTextField>
      <CustomTextField type="text" label={t('tr_subject')}></CustomTextField>
      <CustomTextField multiline label={t('tr_yourMessage')} rows={4} type="text"></CustomTextField>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          gap: '8px',
          alignSelf: 'stretch',
        }}
      >
        <Button variant="main">{t('tr_sendFeedback')}</Button>
        <Button variant="secondary" onClick={handleClose}>{t('tr_cancel')}</Button>
      </Box>
    </Dialog>
  );
};

export default Contact;
