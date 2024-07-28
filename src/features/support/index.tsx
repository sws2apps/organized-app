import { Box, Divider, IconButton } from '@mui/material';
import Button from '@components/button';
import Dialog from '@components/dialog';
import TextMarkup from '@components/text_markup';
import Typography from '@components/typography';
import { IconClose, IconDonate, IconDutiesDistribution } from '@icons/index';
import { useAppTranslation } from '@hooks/index';
import useSupport from './useSupport';

const Support = () => {
  const { t } = useAppTranslation();

  const { handleClose, isOpen, handleOpenDonate, handleOpenDoc } = useSupport();

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          width: '100%',
        }}
      >
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
            <Typography className="h2">{t('tr_supportApp')}</Typography>
            <IconButton
              disableRipple
              sx={{ padding: 0, margin: 0 }}
              onClick={handleClose}
            >
              <IconClose color="var(--black)" />
            </IconButton>
          </Box>
        </Box>
        <TextMarkup content={t('tr_supportAppDesc')} className="body-regular" />
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Typography className="h4">{t('tr_supportAppOption1')}</Typography>
          <TextMarkup
            content={t('tr_supportAppOption1Desc')}
            className="body-regular"
          />
        </Box>
        <Button
          variant="tertiary"
          startIcon={<IconDonate />}
          onClick={handleOpenDonate}
        >
          {t('tr_makeDonation')}
        </Button>
      </Box>

      <Divider
        sx={{
          borderColor: 'var(--accent-200)',
          borderWidth: '1px',
          width: '100%',
        }}
      />

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Typography className="h4">{t('tr_supportAppOption2')}</Typography>
          <TextMarkup
            content={t('tr_supportAppOption2Desc')}
            className="body-regular"
            anchorClassName="h4"
          />
        </Box>
        <Button
          variant="tertiary"
          startIcon={<IconDutiesDistribution />}
          onClick={handleOpenDoc}
        >
          {t('tr_howToContribute')}
        </Button>
      </Box>
    </Dialog>
  );
};

export default Support;
