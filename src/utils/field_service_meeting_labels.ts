import {
  FIELD_SERVICE_MEETING_CATEGORY_TRANSLATION_KEYS,
  FIELD_SERVICE_MEETING_LOCATION_TRANSLATION_KEYS,
  FieldServiceMeetingLocation,
  FieldServiceMeetingCategory,
  type FieldServiceMeetingFormattedType,
} from '@definition/field_service_meetings';

/** The same group and visit context in month badges and exported schedules. */
export const fieldServiceMeetingLabel = (
  meeting: Pick<
    FieldServiceMeetingFormattedType,
    'category' | 'group_id' | 'groupName'
  >,
  t: (key: string) => string
) => {
  const category = t(
    FIELD_SERVICE_MEETING_CATEGORY_TRANSLATION_KEYS[meeting.category]
  );
  if (meeting.category === FieldServiceMeetingCategory.JointMeeting)
    return category;
  const group =
    meeting.groupName?.trim() ||
    t(meeting.group_id ? 'tr_group' : 'tr_allGroups');
  if (meeting.category === FieldServiceMeetingCategory.ServiceOverseerMeeting)
    return `${group} · ${category}`;
  return meeting.group_id ? group : category;
};

/** Short, meaningful location labels while keeping web destinations clickable. */
export const fieldServiceMeetingLocationLabel = (
  meeting: Pick<FieldServiceMeetingFormattedType, 'location' | 'address'>,
  t: (key: string) => string
) => {
  const address = meeting.address?.trim() || '';
  const online = meeting.location === FieldServiceMeetingLocation.Online;
  let addressUrl: string | undefined;
  try {
    const url = new URL(address);
    if (url.protocol === 'https:' || url.protocol === 'http:')
      addressUrl = url.href;
  } catch {
    // Physical addresses and free-form location details are plain text.
  }
  return {
    address: addressUrl
      ? t(online ? 'tr_videoconference' : 'tr_viewLocation')
      : address ||
        t(
          online
            ? 'tr_videoconference'
            : FIELD_SERVICE_MEETING_LOCATION_TRANSLATION_KEYS[meeting.location]
        ),
    addressUrl,
  };
};
