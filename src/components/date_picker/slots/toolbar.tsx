import { useMemo } from 'react';
import { format, isValid } from 'date-fns';
import { Stack } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import Typography from '@components/typography';
import { useAtomValue } from 'jotai';
import { firstDaysOfTheWeekInCongState } from '@states/settings';
import { enUS } from 'date-fns/locale';

type ToolbarProps = {
  selected: Date;
  longDateFormat: string;
};

const Toolbar = ({ selected, longDateFormat }: ToolbarProps) => {
  const { t } = useAppTranslation();
  const firstDayOfTheWeek = useAtomValue(firstDaysOfTheWeekInCongState);

  const longDateFormatLocale = longDateFormat || t('tr_longDateFormat');

  const value = useMemo(() => {
    if (!isValid(selected)) return '***';

    return format(selected, longDateFormatLocale, {
      locale: {
        ...enUS,
        options: { ...enUS.options, weekStartsOn: firstDayOfTheWeek },
      },
    });
  }, [firstDayOfTheWeek, longDateFormatLocale, selected]);

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
      <Typography
        className="h2"
        sx={{
          '&::first-letter': {
            textTransform: 'capitalize',
          },
        }}
      >
        {value}
      </Typography>
    </Stack>
  );
};

export default Toolbar;
