import { Box, Link } from '@mui/material';
import { IconLogo, IconRestart } from '@icons/index';
import { useAppTranslation } from '@hooks/index';
import { AboutProps } from './index.types';
import useAbout from './useAbout';
import Button from '@components/button';
import Dialog from '@components/dialog';
import DialogActions from '@components/dialog_actions';
import IconButton from '@components/icon_button';
import TextMarkup from '@components/text_markup';
import Typography from '@components/typography';
import Tooltip from '@components/tooltip';

const About = (props: AboutProps) => {
  const {
    currentYear,
    handleClose,
    isOpen,
    handleOpenDoc,
    handleOpenSupport,
    handleForceReload,
    privacyText,
  } = useAbout(props);

  const { t } = useAppTranslation();

  return (
    <Dialog open={isOpen} onClose={handleClose} title={t('tr_about')} closable>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          width: '100%',
          padding: '12px 8px 12px 16px',
          borderRadius: 'var(--radius-l)',
          backgroundColor: 'var(--accent-100)',
        }}
      >
        <IconLogo width={40} height={40} />
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography className="h3">Organized</Typography>
          <Typography className="body-small-regular" color="var(--grey-350)">
            {import.meta.env.PACKAGE_VERSION}
          </Typography>
        </Box>

        <Tooltip title={t('tr_forceRefreshButtonTooltip')} delaySpeed="slow">
          <IconButton onClick={handleForceReload}>
            <IconRestart color="var(--black)" />
          </IconButton>
        </Tooltip>
      </Box>

      <TextMarkup content={t('tr_appAboutDesc')} className="body-regular" />

      <Typography className="body-small-regular" color="var(--grey-350)">
        © {currentYear} Scheduling Workbox System ·{' '}
        <Link
          className="body-small-semibold"
          href="https://sws2apps.com/privacy"
          target="_blank"
          rel="noopener"
          sx={{ color: 'var(--accent-dark)' }}
        >
          {privacyText}
        </Link>{' '}
        ·{' '}
        <Link
          className="body-small-semibold"
          href="https://github.com/sws2apps/organized-app"
          target="_blank"
          rel="noopener"
          sx={{ color: 'var(--accent-dark)' }}
        >
          GitHub
        </Link>
      </Typography>

      <DialogActions>
        <Button variant="secondary" onClick={handleOpenDoc}>
          {t('tr_userGuide')}
        </Button>
        <Button variant="main" onClick={handleOpenSupport}>
          {t('tr_supportApp')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default About;
