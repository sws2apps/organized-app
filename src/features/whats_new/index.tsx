import { useAppTranslation } from '@hooks/index';
import useWhatsNew from './useWhatsNew';
import ButtonsAction from './buttons_action';
import Dialog from '@components/dialog';
import ImageViewer from './image_viewer';
import ImprovementsList from './improvements_list';
import WaitingLoader from '@components/waiting_loader';

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
    isLoading,
    swiperRef,
    handleImageChange,
  } = useWhatsNew();

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      sx={{ padding: '24px', position: 'relative' }}
      title={t('tr_newOrganizedUpdate')}
      description={t('tr_newOrganizedUpdateDesc')}
      closable={!isLoading && images.length > 0}
      actions={
        !isLoading && (
          <ButtonsAction
            slides={images}
            current={currentImage}
            onClose={handleClose}
            onNext={handleNextAction}
            onBack={handleBackAction}
          />
        )
      }
    >
      {isLoading && <WaitingLoader size={72} variant="standard" />}

      {!isLoading && (
        <>
          {images.length > 0 && (
            <ImageViewer
              swiperRef={swiperRef}
              slides={images}
              current={currentImage}
              onImageChange={handleImageChange}
            />
          )}

          {improvements.length > 0 && (
            <ImprovementsList
              list={improvements}
              showHeader={images.length > 0}
            />
          )}
        </>
      )}
    </Dialog>
  );
};

export default WhatsNew;
