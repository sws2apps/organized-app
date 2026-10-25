import { atom } from 'jotai';
import { UpcomingEventCategory } from '@definition/upcoming_events';
import { TerritoryCampaign } from '@definition/territory';
import { upcomingEventsState } from '@states/upcoming_events';
import { userDataViewState } from '@states/settings';
import { getTranslation } from '@services/i18n/translation';
import {
  eventVisibleInDataView,
  upcomingEventTitle,
} from '@utils/upcoming_events';

const localDay = (value: string) => {
  const date = new Date(value);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

export const territoryCampaignsState = atom<TerritoryCampaign[]>((get) => {
  const dataView = get(userDataViewState);
  return get(upcomingEventsState)
    .filter(
      (event) =>
        eventVisibleInDataView(event, dataView) &&
        event.event_data.category ===
          UpcomingEventCategory.SpecialCampaignWeek &&
        Number.isFinite(Date.parse(event.event_data.start)) &&
        Number.isFinite(Date.parse(event.event_data.end))
    )
    .map(({ event_uid, event_data }) => ({
      id: event_uid,
      name: upcomingEventTitle(
        event_data,
        getTranslation({ key: 'tr_specialCampaignWeek' })
      ),
      start: localDay(event_data.start),
      end: localDay(event_data.end),
    }));
});
