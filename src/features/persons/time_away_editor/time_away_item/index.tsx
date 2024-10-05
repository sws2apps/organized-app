import { Box } from '@mui/material';
import { IconAdd, IconDelete } from '@icons/index';
import Button from '@components/button';
import DatePicker from '@components/date_picker';
import TextField from '@components/textfield';
import { TimeAwayItemType } from './index.types';
import { useAppTranslation, useBreakpoints } from '@hooks/index';

const TimeAwayItem = ({
  start_date,
  end_date,
  comments,
  id,
  onStartDateChange,
  onEndDateChange,
  onCommentsChange,
  isLast,
  onAdd,
  onDelete,
}: TimeAwayItemType) => {
  const { t } = useAppTranslation();

  const { tabletDown } = useBreakpoints();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Box
        sx={{
          display: 'flex',
          gap: '16px',
          flexWrap: tabletDown ? 'wrap' : 'nowrap',
          justifyContent: 'space-between',
          flexDirection: 'row',
          width: '100%',
        }}
      >
        <DatePicker
          label={t('tr_startDate')}
          value={new Date(start_date)}
          onChange={(value) => onStartDateChange(id, value)}
        />
        <DatePicker
          label={t('tr_endDate')}
          value={end_date === null ? null : new Date(end_date)}
          onChange={(value) => onEndDateChange(id, value)}
        />
      </Box>

      <TextField
        label={t('tr_comments')}
        value={comments}
        onChange={(e) => onCommentsChange(id, e.target.value)}
      />

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          justifyContent: isLast ? 'space-between' : 'flex-end',
          flexDirection: tabletDown ? 'column-reverse' : 'row',
        }}
      >
        {isLast && (
          <Button
            variant="small"
            startIcon={<IconAdd />}
            sx={{ height: '32px', minHeight: '32px !important' }}
            onClick={onAdd}
          >
            {t('tr_add')}
          </Button>
        )}

        <Button
          variant="small"
          color="red"
          startIcon={<IconDelete />}
          sx={{ height: '32px', minHeight: '32px !important' }}
          onClick={() => onDelete(id)}
        >
          {t('tr_delete')}
        </Button>
      </Box>
    </Box>
  );
};

export default TimeAwayItem;
