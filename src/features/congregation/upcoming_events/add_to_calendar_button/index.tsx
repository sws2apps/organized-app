import Button from '@components/button';
import { IconAddMonth } from '@components/icons';
import { useAppTranslation } from '@hooks/index';
import useAddToCalendarButton from './useAddToCalendarButton';
import { AddToCalendarButtonProps } from './index.types';
import IconButton from '@components/icon_button';
import { Box } from '@mui/material';

const AddToCalendarButton = (props: AddToCalendarButtonProps) => {
  const { t } = useAppTranslation();
  const { onAddToCalendarButtonClick } = useAddToCalendarButton(props);

  const variant = props.variant || 'default';

  return variant == 'default' ? (
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
  ) : (
    <Box>
      <IconButton onClick={onAddToCalendarButtonClick}>
        <IconAddMonth color="var(--accent-main)" />
      </IconButton>
    </Box>
  );
};

export default AddToCalendarButton;
