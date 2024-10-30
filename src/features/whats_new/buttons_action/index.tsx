import { Stack } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import { ButtonsActionProps } from './index.types';
import Button from '@components/button';

const ButtonsAction = ({
  slides,
  onClose,
  current,
  onBack,
  onNext,
}: ButtonsActionProps) => {
  const { t } = useAppTranslation();

  return (
    <Stack spacing="8px" width="100%">
      {slides.length > 1 && (
        <>
          <Button variant="main" onClick={onNext}>
            {current === slides.length - 1 ? t('tr_ok') : t('tr_next')}
          </Button>

          {current > 0 && (
            <Button variant="secondary" onClick={onBack}>
              {t('tr_back')}
            </Button>
          )}

          {current === 0 && (
            <Button variant="secondary" onClick={onClose}>
              {t('tr_skip')}
            </Button>
          )}
        </>
      )}

      {slides.length <= 1 && (
        <Button variant="main" onClick={onClose}>
          {t('tr_ok')}
        </Button>
      )}
    </Stack>
  );
};

export default ButtonsAction;
