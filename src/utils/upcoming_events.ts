import {
  UpcomingEventCategory,
  UpcomingEventType,
} from '@definition/upcoming_events';

export const upcomingEventTitle = (
  data: Pick<
    UpcomingEventType['event_data'],
    'category' | 'custom' | 'description'
  >,
  fallback: string
) => {
  if (data.category === UpcomingEventCategory.Custom)
    return data.custom?.trim() || fallback;
  if (data.category === UpcomingEventCategory.SpecialCampaignWeek) {
    return data.custom?.trim() || data.description?.trim() || fallback;
  }
  return fallback;
};

export const eventVisibleInDataView = (
  event: UpcomingEventType,
  dataView: string
) =>
  !event.event_data._deleted &&
  (event.event_data.type === 'main' || event.event_data.type === dataView);

export const canEditUpcomingEvent = (
  roles: readonly string[],
  dataView: string,
  event: UpcomingEventType,
  existing?: UpcomingEventType
) =>
  roles.some((role) =>
    ['admin', 'coordinator', 'secretary', 'upcoming_events'].includes(role)
  ) &&
  event.event_data.type === dataView &&
  (!existing || existing.event_data.type === dataView);
