import { Box } from '@mui/material';
import Button from '@components/button';
import DatePicker from '@components/date_picker';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import { IconAdd, IconDelete } from '@icons/index';
import { DateHistoryType } from './index.types';

const DateHistory = ({
  id,
  end_date,
  onAdd,
  onDelete,
  start_date,
  isLast,
  onEndDateChange,
  onStartDateChange,
  readOnly,
}: DateHistoryType) => {
  const { t } = useAppTranslation();

  const { tabletDown, tablet600Down } = useBreakpoints();

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
          readOnly={readOnly}
        />
        <DatePicker
          label={t('tr_endDate')}
          value={end_date === null ? null : new Date(end_date)}
          onChange={(value) => onEndDateChange(id, value)}
          readOnly={readOnly}
        />
      </Box>

      {!readOnly && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            justifyContent: isLast ? 'space-between' : 'flex-end',
            flexDirection: tablet600Down ? 'row' : 'row-reverse',
          }}
        >
          <Button
            variant="small"
            color="red"
            startIcon={<IconDelete />}
            sx={{
              height: '32px',
              minHeight: '32px !important',
              width: tablet600Down ? 'fit-content' : 'auto',
            }}
            onClick={() => onDelete(id)}
          >
            {t('tr_delete')}
          </Button>
          {isLast && (
            <Button
              variant="small"
              startIcon={<IconAdd />}
              sx={{
                height: '32px',
                minHeight: '32px !important',
                width: tablet600Down ? 'fit-content' : 'auto',
              }}
              onClick={onAdd}
            >
              {t('tr_add')}
            </Button>
          )}
        </Box>
      )}
    </Box>
  );
};

export default DateHistory;
