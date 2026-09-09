import IconLoading from '@components/icon_loading';
import { useAppTranslation } from '@hooks/index';
import useContact from './useContact';
import Button from '@components/button';
import Dialog from '@components/dialog';
import DialogActions from '@components/dialog_actions';
import TextMarkup from '@components/text_markup';
import TextField from '@components/textfield';

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
    <Dialog
      open={isOpen}
      onClose={handleClose}
      title={t('tr_shareFeeback')}
      closable
    >
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

      <DialogActions>
        <Button
          variant="secondary"
          disabled={isProcessing}
          onClick={handleClose}
        >
          {t('tr_cancel')}
        </Button>
        <Button
          variant="main"
          onClick={handleSendMessage}
          endIcon={isProcessing && <IconLoading />}
        >
          {t('tr_sendFeedback')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Contact;
