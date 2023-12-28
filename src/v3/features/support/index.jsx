import { Box, Divider, IconButton } from '@mui/material';
import { Button, Dialog, TextMarkup, Typography } from '@components';
import { IconClose, IconDonate, IconDutiesDistribution } from '@icons';
import { useAppTranslation } from '@hooks';
import useSupport from './useSupport';

const Support = () => {
  const { t } = useAppTranslation();

  const { handleClose, isOpen, handleOpenDonate, handleOpenDoc } = useSupport();

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
          <IconDonate color="var(--black)" />
          <Box
            sx={{
              display: 'flex',
              padding: 'var(--radius-none)',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              flex: '1 0 0',
            }}
          >
            <Typography variant="h2">{t('supportApp')}</Typography>
            <IconButton disableRipple sx={{ padding: 0, margin: 0 }} onClick={handleClose}>
              <IconClose color="var(--black)" />
            </IconButton>
          </Box>
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
          <TextMarkup content={t('supportAppOption2Desc')} className="body-regular" anchorClassName="h4" />
        </Box>
        <Button variant="tertiary" startIcon={<IconDutiesDistribution />} onClick={handleOpenDoc}>
          {t('howToContribute')}
        </Button>
      </Box>
    </Dialog>
  );
};

export default Support;
