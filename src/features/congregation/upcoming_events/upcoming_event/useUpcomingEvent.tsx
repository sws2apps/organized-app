import { formatDate } from 'date-fns';
import { UpcomingEventProps } from './index.types';
import { decorationsForEvent } from '../decorations_for_event';

const useUpcomingEvent = ({ data }: UpcomingEventProps) => {
  const getEventTime = formatDate(data.time.value, 'HH:mm');
  const eventDecoration = decorationsForEvent[data.type.value];

  return { getEventTime, eventDecoration };
};

export default useUpcomingEvent;
