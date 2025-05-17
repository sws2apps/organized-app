import { useAppTranslation } from '@hooks/index';
import { hour24FormatState } from '@states/settings';
import { format, formatDate } from 'date-fns';
import { useAtomValue } from 'jotai';
import { useMemo } from 'react';
import { UpcomingEventDateProps } from './index.types';

let allLocales;
import('date-fns/locale').then((locales) => {
  allLocales = locales;
});

const useUpcomingEventDate = (props: UpcomingEventDateProps) => {
  const { t } = useAppTranslation();
  const hour24 = useAtomValue(hour24FormatState);

  const startTime = useMemo(
    () => new Date(props.data.start),
    [props.data.start]
  );
  const endTime = useMemo(() => new Date(props.data.end), [props.data.end]);

  const formatEventDateDate = (date: Date) => {
    return formatDate(date, 'MMM. d', {
      locale:
        allLocales && allLocales[t('tr_iso')]
          ? allLocales[t('tr_iso')]
          : undefined,
    });
  };

  const formatEventDateTime = (startTime: Date, endTime: Date) => {
    return `${format(startTime, hour24 ? 'HH:mm' : 'hh:mm a')} - ${format(endTime, hour24 ? 'HH:mm' : 'hh:mm a')}`;
  };

  return { formatEventDateDate, formatEventDateTime, startTime, endTime };
};

export default useUpcomingEventDate;
