import Button from '@components/button';
import { IconAddMonth } from '@components/icons';
import { useAppTranslation } from '@hooks/index';
import useAddToCalendarButton from './useAddToCalendarButton';
import { AddToCalendarButtonProps } from './index.types';

const AddToCalendarButton = (props: AddToCalendarButtonProps) => {
  const { t } = useAppTranslation();
  const { onAddToCalendarButtonClick } = useAddToCalendarButton(props);

  return (
    <Button
      startIcon={<IconAddMonth />}
      variant="small"
      onClick={onAddToCalendarButtonClick}
      sx={{
        height: 'max-content',
      }}
    >
      {t('tr_addToCalendar')}
    </Button>
  );
};

export default AddToCalendarButton;
