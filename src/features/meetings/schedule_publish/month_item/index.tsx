import { Box, Stack } from '@mui/material';
import { IconPublishedSchedule } from '@components/icons';
import { useAppTranslation } from '@hooks/index';
import { MonthItemProps } from './index.types';
import useMonthItem from './useMonthItem';
import Checkbox from '@components/checkbox';

const MonthItem = ({ data, onChange }: MonthItemProps) => {
  const { t } = useAppTranslation();

  const { monthName } = useMonthItem(data.month);

  return (
    <Stack
      justifyContent="space-between"
      alignItems="center"
      flexDirection="row"
    >
      <Checkbox
        label={monthName}
        checked={data.checked}
        onChange={(e) => onChange(e.target.checked, data.month)}
      />

      {data.published && (
        <Box
          title={t('tr_published')}
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <IconPublishedSchedule color="var(--accent-main)" />
        </Box>
      )}
    </Stack>
  );
};

export default MonthItem;
