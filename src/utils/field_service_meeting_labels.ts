import {
  FIELD_SERVICE_MEETING_CATEGORY_TRANSLATION_KEYS,
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
