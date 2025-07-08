import Button from '@components/button';
import { AddToCalendarProps } from './index.types';
import { IconAddMonth } from '@components/icons';
import { useAppTranslation } from '@hooks/index';
import { Box } from '@mui/material';
import useAddToCalendar from './useAddToCalendar';
import IconLoading from '@components/icon_loading';

const AddToCalendar = (props: AddToCalendarProps) => {
  const { t } = useAppTranslation();
  const { isProcessing, handleAddToCalendar } = useAddToCalendar(props);

  return (
    <Box className="upc-add-to-calendar-btn">
      <Button
        variant="small"
        startIcon={isProcessing ? <IconLoading /> : <IconAddMonth />}
        sx={{ width: '100%' }}
        onClick={handleAddToCalendar}
      >
        {t('tr_addToCalendar')}
      </Button>
    </Box>
  );
};

export default AddToCalendar;
