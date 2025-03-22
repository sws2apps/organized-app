import { formatDate } from 'date-fns';
import { UpcomingEventProps } from './index.types';
import { decorationsForEvent } from '../utils';

const useUpcomingEvent = (props: UpcomingEventProps) => {
  const getEventTime = formatDate(props.data.time, 'HH:mm');
  const eventDecoration = decorationsForEvent[props.data.type];

  return { getEventTime, eventDecoration };
};

export default useUpcomingEvent;
