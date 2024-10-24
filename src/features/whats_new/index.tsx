import { Box, Stack } from '@mui/material';
import { IconClose } from '@components/icons';
import { useAppTranslation } from '@hooks/index';
import useWhatsNew from './useWhatsNew';
import ButtonsAction from './buttons_action';
import Dialog from '@components/dialog';
import IconButton from '@components/icon_button';
import ImageViewer from './image_viewer';
import ImprovementsList from './improvements_list';
import Typography from '@components/typography';

const WhatsNew = () => {
  const { t } = useAppTranslation();

  const {
    open,
    handleClose,
    currentImage,
    images,
    improvements,
    handleBackAction,
    handleNextAction,
  } = useWhatsNew();

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      sx={{ padding: '24px', position: 'relative' }}
    >
      <Stack spacing="8px" width="100%">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography className="h2">{t('tr_newOrganizedUpdate')}</Typography>

          {images.length > 0 && (
            <IconButton onClick={handleClose}>
              <IconClose color="var(--black)" />
            </IconButton>
          )}
        </Box>

        <Typography color="var(--grey-400)">
          {t('tr_newOrganizedUpdateDesc')}
        </Typography>
      </Stack>

      {images.length > 0 && (
        <ImageViewer slides={images} current={currentImage} />
      )}

      {improvements.length > 0 && <ImprovementsList list={improvements} />}

      <ButtonsAction
        slides={images}
        current={currentImage}
        onClose={handleClose}
        onNext={handleNextAction}
        onBack={handleBackAction}
      />
    </Dialog>
  );
};

export default WhatsNew;
