import { Box, IconButton } from '@mui/material';
import Button from '@components/button';
import Dialog from '@components/dialog';
import TextMarkup from '@components/text_markup';
import Typography from '@components/typography';
import { IconClose, IconInfo, IconLogo } from '@icons/index';
import { useAppTranslation } from '@hooks/index';
import useAbout from './useAbout';

const About = () => {
  const { currentYear, handleClose, isOpen, handleOpenDoc, handleOpenSupport } = useAbout();

  const { t } = useAppTranslation();

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: '8px', width: '100%' }}>
        <IconInfo color="var(--black)" />
        <Box
          sx={{
            display: 'flex',
            padding: 'var(--radius-none)',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flex: '1 0 0',
          }}
        >
          <Typography className="h2">{t('tr_about')}</Typography>
          <IconButton disableRipple sx={{ padding: 0, margin: 0 }} onClick={handleClose}>
            <IconClose color="var(--black)" />
          </IconButton>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', padding: 'var(--radius-none)', alignItems: 'center', gap: '16px' }}>
        <IconLogo width={40} height={40} />
        <Box>
          <Typography className="h3">{t('tr_appFullName')}</Typography>
          <Typography className="body-regular" color="var(--grey-350)">
            {import.meta.env.PACKAGE_VERSION}
          </Typography>
        </Box>
      </Box>

      <TextMarkup content={t('tr_appAboutDesc')} className="body-regular" />

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          gap: '8px',
          alignSelf: 'stretch',
        }}
      >
        <Button variant="main" onClick={handleOpenSupport}>
          {t('tr_wantSupportApp')}
        </Button>
        <Button variant="secondary" onClick={handleOpenDoc}>
          {t('tr_howToUseApp')}
        </Button>
      </Box>

      <Typography className="body-small-regular" color="var(--grey-350)">
        Copyright © {currentYear} | Organized [sws2apps]
      </Typography>
    </Dialog>
  );
};

export default About;
