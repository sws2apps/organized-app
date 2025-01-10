import { Box, IconButton } from '@mui/material';
import { IconClose, IconMail } from '@icons/index';
import { useAppTranslation } from '@hooks/index';
import useContact from './useContact';
import Button from '@components/button';
import Dialog from '@components/dialog';
import TextMarkup from '@components/text_markup';
import Typography from '@components/typography';
import TextField from '@components/textfield';
import WaitingLoader from '@components/waiting_loader';

const Contact = () => {
  const { t } = useAppTranslation();

  const {
    handleClose,
    isOpen,
    setSubject,
    subject,
    message,
    setMessage,
    handleSendMessage,
    isProcessing,
  } = useContact();

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '8px',
          width: '100%',
        }}
      >
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
          <IconButton
            disableRipple
            sx={{ padding: 0, margin: 0 }}
            onClick={handleClose}
          >
            <IconClose color="var(--black)" />
          </IconButton>
        </Box>
      </Box>

      <TextMarkup
        content={t('tr_shareFeebackDesc')}
        className="body-regular"
        anchorClassName="body-regular"
      />

      <TextField
        type="text"
        label={t('tr_subject')}
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
      />

      <TextField
        multiline
        label={t('tr_yourMessage')}
        rows={4}
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          gap: '8px',
          alignSelf: 'stretch',
        }}
      >
        <Button
          variant="main"
          onClick={handleSendMessage}
          endIcon={
            isProcessing && <WaitingLoader size={22} variant="standard" />
          }
        >
          {t('tr_sendFeedback')}
        </Button>
        <Button
          variant="secondary"
          disabled={isProcessing}
          onClick={handleClose}
        >
          {t('tr_cancel')}
        </Button>
      </Box>
    </Dialog>
  );
};

export default Contact;
