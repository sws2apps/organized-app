import { Box, Dialog, DialogContent, Divider } from '@mui/material';
import { Button, TextMarkup, Typography } from '@components';
import { IconDonate } from '@icons';
import { useAppTranslation } from '@hooks';
import useAbout from './useSupport';

const Support = () => {
  const { t } = useAppTranslation();

  const { handleClose, isOpen, handleOpenDonate } = useAbout();

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
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <IconDonate color="var(--black)" />
              <Typography variant="h2">{t('supportApp')}</Typography>
            </Box>
            <TextMarkup content={t('supportAppDesc')} className="body-regular" />
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Typography variant="h4">{t('supportAppOption1')}</Typography>
              <TextMarkup content={t('supportAppOption1Desc')} className="body-regular" />
            </Box>
            <Button variant="tertiary" startIcon={<IconDonate />} onClick={handleOpenDonate}>
              {t('makeDonation')}
            </Button>
          </Box>

          <Divider sx={{ borderColor: 'var(--accent-200)', borderWidth: '1px', width: '100%' }} />

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Typography variant="h4">{t('supportAppOption2')}</Typography>
              <TextMarkup content={t('supportAppOption2Desc')} className="body-regular" />
            </Box>
            <Button variant="tertiary" startIcon={<IconDonate />}>
              {t('howToContribute')}
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Support;
