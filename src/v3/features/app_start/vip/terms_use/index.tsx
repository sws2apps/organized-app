import { Box, Dialog } from '@mui/material';
import { IconDownload, IconHelp, IconLock, IconManageAccess } from '@icons/index';
import Button from '@components/button';
import Checkbox from '@components/checkbox';
import TextMarkup from '@components/text_markup';
import Typography from '@components/typography';
import { useAppTranslation } from '@hooks/index';
import useTermsUse from './useTermsUse';

const itemQuestion = {
  display: 'flex',
  gap: '8px',
  alignItems: 'center',
};

const TermsUse = () => {
  const { t } = useAppTranslation();
  const { handleTermsUse, readComplete, setReadComplete, showTermsUse } = useTermsUse();

  return (
    <Dialog
      fullWidth={true}
      maxWidth={false}
      open={showTermsUse}
      sx={{
        maxWidth: '993px',
        width: '100%',
        margin: 'auto',
        '.MuiBackdrop-root': {
          backgroundColor: 'var(--accent-dark-overlay)',
          opacity: '0.48 !important',
        },
        '.MuiDialog-paper': {
          width: '100%',
          maxWidth: '100%',
          margin: '12px',
          maxHeight: 'calc(100vh - 115px)',
          borderRadius: { mobile: 'var(--radius-xl)', laptop: 'var(--radius-xxl)' },
          background: 'var(--white)',
          padding: { mobile: '24px 16px', tablet: '24px 16px 24px 24px', laptop: '48px 19px 48px 48px' },
        },
      }}
      PaperProps={{
        className: 'pop-up-shadow',
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '16px' }}>
        <Typography className="h1">{t('tr_importantNotice')}</Typography>

        <Box sx={itemQuestion}>
          <IconHelp color="var(--black)" />
          <Typography className="h3">{t('tr_whatIsApp')}</Typography>
        </Box>

        <TextMarkup className="body-small-regular" color="var(--grey-400)" content={t('tr_descApp')} />

        <Box sx={itemQuestion}>
          <IconDownload color="var(--black)" />
          <Typography className="h3">{t('tr_appPWA')}</Typography>
        </Box>

        <TextMarkup className="body-small-regular" color="var(--grey-400)" content={t('tr_appPWADesc')} />

        <Box sx={itemQuestion}>
          <IconManageAccess color="var(--black)" />
          <Typography className="h3">{t('tr_appSecure')}</Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <TextMarkup className="body-small-regular" color="var(--grey-400)" content={t('tr_appSecureDesc')} />

          <Box
            sx={{ flex: '1 0 0', padding: '8px', borderRadius: 'var(--radius-s)', background: 'var(--red-secondary)' }}
          >
            <TextMarkup className="body-small-regular" color="var(--red-main)" content={t('tr_clearBrowserData')} />
          </Box>
        </Box>

        <Box sx={itemQuestion}>
          <IconLock color="var(--black)" />
          <Typography className="h3">{t('tr_appPrivacy')}</Typography>
        </Box>

        <TextMarkup className="body-small-regular" color="var(--grey-400)" content={t('tr_appPrivacyDesc')} />

        <Checkbox
          checked={readComplete}
          onChange={(e) => setReadComplete(e.target.checked)}
          label={t('tr_readComplete')}
        />

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '10px',
            width: '100%',
          }}
        >
          <Button variant="main" disabled={!readComplete} onClick={handleTermsUse} sx={{ flex: '1 0 0' }}>
            {t('tr_next')}
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};

export default TermsUse;
