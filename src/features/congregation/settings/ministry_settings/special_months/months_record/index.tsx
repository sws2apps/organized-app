import { Box, Stack } from '@mui/material';
import { IconAdd, IconDelete } from '@components/icons';
import {
  useAppTranslation,
  useBreakpoints,
  useCurrentUser,
} from '@hooks/index';
import { MonthsRecordProps } from './index.types';
import useMonthsRecord from './useMonthsRecord';
import DatePicker from '@components/date_picker';
import Button from '@components/button';

const MonthsRecord = (props: MonthsRecordProps) => {
  const { t } = useAppTranslation();

  const { tabletDown } = useBreakpoints();

  const { isServiceCommittee } = useCurrentUser();

  const {
    endMonth,
    startMonth,
    handleEndDateChange,
    handleStartDateChange,
    startMinDate,
  } = useMonthsRecord(props);

  return (
    <Stack spacing="16px">
      <Box
        sx={{
          display: 'flex',
          gap: '16px',
          flexDirection: tabletDown ? 'column' : 'row',
        }}
      >
        <DatePicker
          label={t('tr_startDate')}
          value={startMonth}
          onChange={handleStartDateChange}
          minDate={startMinDate}
          readOnly={!isServiceCommittee}
        />

        <DatePicker
          label={t('tr_endDate')}
          value={endMonth}
          onChange={handleEndDateChange}
          minDate={startMonth}
          readOnly={!isServiceCommittee || startMonth === null}
        />
      </Box>

      {isServiceCommittee && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            justifyContent: props.isLast ? 'space-between' : 'flex-end',
            flexDirection: tabletDown ? 'column-reverse' : 'row',
          }}
        >
          {props.isLast && (
            <Button
              variant="small"
              startIcon={<IconAdd />}
              sx={{ height: '32px', minHeight: '32px !important' }}
              onClick={props.onAdd}
            >
              {t('tr_add')}
            </Button>
          )}

          <Button
            variant="small"
            color="red"
            startIcon={<IconDelete />}
            sx={{ height: '32px', minHeight: '32px !important' }}
            onClick={() => props.onDelete(props.month.id)}
          >
            {t('tr_delete')}
          </Button>
        </Box>
      )}
    </Stack>
  );
};

export default MonthsRecord;
