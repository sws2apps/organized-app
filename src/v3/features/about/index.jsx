import { Box, Dialog, DialogContent } from '@mui/material';
import { Button, TextMarkup, Typography } from '@components';
import { IconInfo, IconLogo } from '@icons';
import { useAppTranslation } from '@hooks';
import useAbout from './useAbout';

const About = () => {
  const { currentYear, handleClose, isOpen, handleOpenDoc, handleOpenSupport } = useAbout();

  const { t } = useAppTranslation();

  return (
    <Box>
      <Dialog
        open={isOpen}
        onClose={handleClose}
        sx={{
          '.MuiPaper-root': {
            margin: { mobile: '16px', tablet: '24px', desktop: '32px' },
          },
        }}
        PaperProps={{
          className: 'pop-up-shadow',
          style: {
            maxWidth: '560px',
            borderRadius: 'var(--radius-xxl)',
            backgroundColor: 'var(--white)',
          },
        }}
        slotProps={{
          backdrop: {
            style: {
              backgroundColor: 'var(--accent-dark-overlay)',
            },
          },
        }}
      >
        <DialogContent
          sx={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'flex-start' }}
        >
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
            <IconInfo color="var(--black)" />
            <Typography variant="h2">{t('about')}</Typography>
          </Box>

          <Box sx={{ display: 'flex', padding: 'var(--radius-none)', alignItems: 'center', gap: '16px' }}>
            <IconLogo width={40} height={40} />
            <Box>
              <Typography variant="h3">{t('appFullName')}</Typography>
              <Typography variant="body-regular" color="var(--grey-350)">
                {import.meta.env.PACKAGE_VERSION}
              </Typography>
            </Box>
          </Box>

          <TextMarkup content={t('appAboutDesc')} className="body-regular" />

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
              {t('wantSupportApp')}
            </Button>
            <Button variant="secondary" onClick={handleOpenDoc}>
              {t('howToUseApp')}
            </Button>
          </Box>

          <Typography variant="body-small-regular" color="var(--grey-350)">
            Copyright © {currentYear} | Organized [sws2apps]
          </Typography>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default About;
