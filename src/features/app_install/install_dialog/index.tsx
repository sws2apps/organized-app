import { Stack } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import { PwaInstallGuide } from '@utils/pwa';
import Button from '@components/button';
import Dialog from '@components/dialog';
import TextMarkup from '@components/text_markup';

type InstallDialogProps = {
  open: boolean;
  onClose: VoidFunction;
  guide: PwaInstallGuide;
};

// every browser puts the command somewhere else, so each one gets its own
// short set of steps instead of a single vague sentence
const GUIDE_TEXT: Record<PwaInstallGuide, string> = {
  'ios-safari': 'tr_installAppStepsIosSafari',
  'ios-other-browser': 'tr_installAppStepsIosOtherBrowser',
  'safari-desktop': 'tr_installAppStepsSafariDesktop',
  'chromium-mobile': 'tr_installAppStepsChromiumMobile',
  'chromium-desktop': 'tr_installAppStepsChromiumDesktop',
  unsupported: 'tr_installAppStepsUnsupported',
};

const InstallDialog = ({ open, onClose, guide }: InstallDialogProps) => {
  const { t } = useAppTranslation();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={t('tr_installApp')}
      actions={
        <Button variant="main" onClick={onClose} sx={{ width: '100%' }}>
          {t('tr_ok')}
        </Button>
      }
    >
      <Stack spacing="4px" width="100%">
        <TextMarkup
          content={t(GUIDE_TEXT[guide])}
          className="body-regular"
          color="var(--grey-400)"
        />
      </Stack>
    </Dialog>
  );
};

export default InstallDialog;
