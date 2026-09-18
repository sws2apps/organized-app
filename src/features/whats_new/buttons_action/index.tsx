import { useAppTranslation } from '@hooks/index';
import { ButtonsActionProps } from './index.types';
import Button from '@components/button';
import DialogActions from '@components/dialog_actions';

const ButtonsAction = ({
  slides,
  onClose,
  current,
  onBack,
  onNext,
}: ButtonsActionProps) => {
  const { t } = useAppTranslation();

  return (
    <DialogActions>
      {slides.length > 1 && current > 0 && (
        <Button variant="secondary" onClick={onBack}>
          {t('tr_back')}
        </Button>
      )}

      {slides.length > 1 && current === 0 && (
        <Button variant="secondary" onClick={onClose}>
          {t('tr_skip')}
        </Button>
      )}

      {slides.length > 1 && (
        <Button variant="main" onClick={onNext}>
          {current === slides.length - 1 ? t('tr_ok') : t('tr_next')}
        </Button>
      )}

      {slides.length <= 1 && (
        <Button variant="main" onClick={onClose}>
          {t('tr_ok')}
        </Button>
      )}
    </DialogActions>
  );
};

export default ButtonsAction;
