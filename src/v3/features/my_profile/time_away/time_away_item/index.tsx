import { Box } from '@mui/material';
import Button from '@components/button';
import DatePicker from '@components/date_picker';
import TextField from '@components/textfield';
import { TimeAwayItemProps } from '../index.types';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import { IconAdd, IconDelete } from '@icons/index';
import useTimeAwayItem from './useTimeAwayItem';

const TimeAwayItem = (props: TimeAwayItemProps) => {
  const { timeAway, lastItem, onAdd, onDelete } = props;

  const { t } = useAppTranslation();

  const { tabletDown } = useBreakpoints();

  const {
    comments,
    end_date,
    handleUpdateComments,
    handleUpdateEndDate,
    handleUpdateStartDate,
    start_date,
  } = useTimeAwayItem(timeAway);

  const isLast = lastItem || false;

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
          value={new Date(start_date.value)}
          onChange={(value) => handleUpdateStartDate(value)}
        />
        <DatePicker
          label={t('tr_endDate')}
          value={end_date === null ? null : new Date(end_date.value)}
          onChange={(value) => handleUpdateEndDate(value)}
        />
      </Box>

      <TextField
        label={t('tr_comments')}
        value={comments}
        onChange={(e) => handleUpdateComments(e.target.value)}
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
          onClick={onDelete}
        >
          {t('tr_delete')}
        </Button>
      </Box>
    </Box>
  );
};

export default TimeAwayItem;
