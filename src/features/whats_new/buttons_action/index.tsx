import { Stack } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import { ButtonsActionProps } from './index.types';
import Button from '@components/button';

const ButtonsAction = ({ slides, onClose, current }: ButtonsActionProps) => {
  const { t } = useAppTranslation();

  return (
    <Stack spacing="8px" width="100%">
      {slides.length > 0 && (
        <>
          <Button variant="main">
            {current === slides.length - 1 ? t('tr_ok') : t('tr_next')}
          </Button>

          <Button variant="secondary">{t('tr_back')}</Button>
        </>
      )}

      {slides.length === 0 && (
        <Button variant="main" onClick={onClose}>
          {t('tr_ok')}
        </Button>
      )}
    </Stack>
  );
};

export default ButtonsAction;
