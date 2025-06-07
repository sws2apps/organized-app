import { useAtomValue } from 'jotai';
import { formatLongDate } from '@utils/date';
import { settingsState, userDataViewState } from '@states/settings';
import { decorationsForEvent } from '../decorations_for_event';
import { UpcomingEventProps } from './index.types';

const useUpcomingEvent = ({ data }: UpcomingEventProps) => {
  const settings = useAtomValue(settingsState);
  const dataView = useAtomValue(userDataViewState);

  const timeFormat = settings.cong_settings.format_24h_enabled.find(
    (record) => record.type === dataView
  ).value;

  const getEventTime = formatLongDate(
    new Date(data.event_data.time),
    '',
    timeFormat
  );
  const eventDecoration =
    data.event_data.type !== undefined &&
    data.event_data.type < decorationsForEvent.length
      ? decorationsForEvent[data.event_data.type]
      : decorationsForEvent[decorationsForEvent.length - 1];

  return { getEventTime, eventDecoration, timeFormat };
};

export default useUpcomingEvent;
