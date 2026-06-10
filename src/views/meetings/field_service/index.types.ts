export type FieldServiceMeetingTemplateMeeting = {
  id: string;
  time: string;
  address: string;
  conductor: string;
};

export type FieldServiceMeetingTemplateDay = {
  id: string;
  dateLabel: string;
  meetings: FieldServiceMeetingTemplateMeeting[];
};

export type FieldServiceMeetingTemplateMonth = {
  id: string;
  title: string;
  days: FieldServiceMeetingTemplateDay[];
};

export type FieldServiceMeetingTemplateProps = {
  congregation: string;
  groupLabel?: string;
  lang: string;
  months: FieldServiceMeetingTemplateMonth[];
};
