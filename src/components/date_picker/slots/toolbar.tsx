import { useMemo } from 'react';
import { format, isValid, Locale } from 'date-fns';
import { Stack } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import Typography from '@components/typography';
import { useRecoilValue } from 'recoil';
import { currentLocaleState } from '@states/app';

type ToolbarProps = {
  selected: Date;
  longDateFormat: string;
};

const Toolbar = ({ selected, longDateFormat }: ToolbarProps) => {
  const { t } = useAppTranslation();
  const currentLocale: Locale = useRecoilValue(currentLocaleState);

  const longDateFormatLocale = longDateFormat || t('tr_longDateFormat');

  const value = useMemo(() => {
    if (!isValid(selected)) return '***';

    return format(selected, longDateFormatLocale, { locale: currentLocale });
  }, [currentLocale, longDateFormatLocale, selected]);

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
