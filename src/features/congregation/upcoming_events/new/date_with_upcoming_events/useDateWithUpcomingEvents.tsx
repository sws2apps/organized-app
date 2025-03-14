import useCurrentUser from '@hooks/useCurrentUser';
import { DateWithUpcomingEventsProps } from './index.types';
import { useAppTranslation } from '@hooks/index';
import { formatDate } from 'date-fns';
import { useEffect, useState } from 'react';

const useDateWithUpcomingEvents = (props: DateWithUpcomingEventsProps) => {
  const { t } = useAppTranslation();
  const { isAdmin } = useCurrentUser();

  const [localEvents, setLocalEvents] = useState(props.data.events);

  useEffect(() => {
    setLocalEvents((prev) =>
      prev.sort(
        (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()
      )
    );
  }, [localEvents]);

  const getFormattedDate = formatDate(
    new Date(props.data.date),
    t('tr_longDateFormat')
  );

  return { isAdmin, getFormattedDate, localEvents };
};

export default useDateWithUpcomingEvents;
