import { formatDate } from 'date-fns';
import { UpcomingEventProps } from './index.types';
import { decorationsForEvent } from '../decorations_for_event';

const useUpcomingEvent = ({ data }: UpcomingEventProps) => {
  const getEventTime = formatDate(data.time.value, 'HH:mm');
  const eventDecoration =
    data.type.value !== undefined &&
    data.type.value < decorationsForEvent.length
      ? decorationsForEvent[data.type.value]
      : decorationsForEvent[decorationsForEvent.length - 1];

  return { getEventTime, eventDecoration };
};

export default useUpcomingEvent;
