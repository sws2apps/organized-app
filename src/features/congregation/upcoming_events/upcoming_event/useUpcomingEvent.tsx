import { formatDate } from 'date-fns';
import { UpcomingEventProps } from './index.types';
import { decorationsForEvent } from '../decorations_for_event';

const useUpcomingEvent = ({ data }: UpcomingEventProps) => {
  const getEventTime = formatDate(data.time, 'HH:mm');
  const eventDecoration =
    data.type !== undefined && data.type < decorationsForEvent.length
      ? decorationsForEvent[data.type]
      : decorationsForEvent[decorationsForEvent.length - 1];

  return { getEventTime, eventDecoration };
};

export default useUpcomingEvent;
