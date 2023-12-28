import { Box, Dialog } from '@mui/material';
import { Button, Checkbox, TextMarkup, Typography } from '@components';
import { IconDownload, IconHelp, IconLock, IconManageAccess } from '@icons';
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
        <Typography variant="h1">{t('importantNotice')}</Typography>

        <Box sx={itemQuestion}>
          <IconHelp color="var(--black)" />
          <Typography variant="h3">{t('whatIsCPE')}</Typography>
        </Box>

        <TextMarkup className="body-small-regular" color="var(--grey-400)" content={t('descCPE')} />

        <Box sx={itemQuestion}>
          <IconDownload color="var(--black)" />
          <Typography variant="h3">{t('appPWA')}</Typography>
        </Box>

        <TextMarkup className="body-small-regular" color="var(--grey-400)" content={t('appPWADesc')} />

        <Box sx={itemQuestion}>
          <IconManageAccess color="var(--black)" />
          <Typography variant="h3">{t('appSecure')}</Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <TextMarkup className="body-small-regular" color="var(--grey-400)" content={t('appSecureDesc')} />

          <Box
            sx={{ flex: '1 0 0', padding: '8px', borderRadius: 'var(--radius-s)', background: 'var(--red-secondary)' }}
          >
            <TextMarkup className="body-small-regular" color="var(--red-main)" content={t('clearBrowserData')} />
          </Box>
        </Box>

        <Box sx={itemQuestion}>
          <IconLock color="var(--black)" />
          <Typography variant="h3">{t('appPrivacy')}</Typography>
        </Box>

        <TextMarkup className="body-small-regular" color="var(--grey-400)" content={t('appPrivacyDesc')} />

        <Checkbox
          checked={readComplete}
          onChange={(e) => setReadComplete(e.target.checked)}
          label={t('readComplete')}
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
            {t('next')}
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};

export default TermsUse;
