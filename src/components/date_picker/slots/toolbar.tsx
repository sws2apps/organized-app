import { useMemo } from 'react';
import { Stack } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import { formatLongDateWithShortVars, isValidDate } from '@utils/date';
import Typography from '@components/typography';

type ToolbarProps = { selected: Date | null };

const Toolbar = ({ selected }: ToolbarProps) => {
  const { t } = useAppTranslation();

  const value = useMemo(() => {
    if (!selected) return '***';
    if (!isValidDate(selected)) return '***';

    return formatLongDateWithShortVars(selected);
  }, [selected]);

  return (
    <Stack
      direction={'column'}
      sx={{
        padding: '16px 12px 12px 24px',
        borderBottom: '1px solid var(--accent-200)',
      }}
    >
      <Typography className="body-small-semibold" color={'var(--grey-400)'}>
        {t('tr_pickerSelectDate')}
      </Typography>
      <Typography className="h2">{value}</Typography>
    </Stack>
  );
};

export default Toolbar;
