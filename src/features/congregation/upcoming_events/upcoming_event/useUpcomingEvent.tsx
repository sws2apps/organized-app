import { UpcomingEventProps } from './index.types';
import { decorationsForEvent } from '../decorations_for_event';
import { formatLongDate } from '@services/dateformat';
import { useRecoilValue } from 'recoil';
import { settingsState, userDataViewState } from '@states/settings';

const useUpcomingEvent = ({ data }: UpcomingEventProps) => {
  const settings = useRecoilValue(settingsState);
  const dataView = useRecoilValue(userDataViewState);

  const timeFormat = settings.cong_settings.format_24h_enabled.find(
    (record) => record.type === dataView
  ).value;

  const getEventTime = formatLongDate(new Date(data.time), '', timeFormat);
  const eventDecoration =
    data.type !== undefined && data.type < decorationsForEvent.length
      ? decorationsForEvent[data.type]
      : decorationsForEvent[decorationsForEvent.length - 1];

  return { getEventTime, eventDecoration, timeFormat };
};

export default useUpcomingEvent;
