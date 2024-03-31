import { Box } from '@mui/material';
import Button from '@components/button';
import DatePicker from '@components/date_picker';
import TextField from '@components/textfield';
import { TimeAwayItemProps } from '../index.types';
import { useAppTranslation } from '@hooks/index';
import { IconAdd, IconDelete } from '@icons/index';
import useTimeAwayItem from './useTimeAwayItem';

const TimeAwayItem = (props: TimeAwayItemProps) => {
  const { timeAway, lastItem, onAdd, onDelete, tabletDown } = props;

  const { t } = useAppTranslation();
  const { comments, endDate, handleUpdateComments, handleUpdateEndDate, handleUpdateStartDate, startDate } =
    useTimeAwayItem(timeAway);

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
          value={new Date(startDate)}
          onChange={(value) => handleUpdateStartDate(value)}
        />
        <DatePicker
          label={t('tr_endDate')}
          value={endDate === null ? null : new Date(endDate)}
          onChange={(value) => handleUpdateEndDate(value)}
        />
      </Box>

      <TextField label={t('tr_comments')} value={comments} onChange={(e) => handleUpdateComments(e.target.value)} />

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          justifyContent: isLast ? 'space-between' : 'flex-end',
          flexWrap: 'wrap',
        }}
      >
        <Button
          variant="small"
          color="red"
          startIcon={<IconDelete />}
          sx={{ height: '32px', minHeight: '32px !important' }}
          onClick={onDelete}
        >
          {t('tr_delete')}
        </Button>

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
      </Box>
    </Box>
  );
};

export default TimeAwayItem;
