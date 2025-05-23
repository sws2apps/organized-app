import { useMemo } from 'react';
import { isValid } from 'date-fns';
import { Stack } from '@mui/material';
import { formatDate } from '@services/dateformat';
import { useAppTranslation } from '@hooks/index';
import Typography from '@components/typography';

type ToolbarProps = {
  selected: Date;
  longDateFormat: string;
};

const Toolbar = ({ selected, longDateFormat }: ToolbarProps) => {
  const { t } = useAppTranslation();

  const longDateFormatLocale = longDateFormat || t('tr_longDateFormat');

  const value = useMemo(() => {
    if (!isValid(selected)) return '***';

    return formatDate(selected, longDateFormatLocale);
  }, [longDateFormatLocale, selected]);

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
