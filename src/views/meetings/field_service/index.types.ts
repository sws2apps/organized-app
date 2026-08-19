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
  groupLabel: string;
  lang: string;
  months: FieldServiceMeetingTemplateMonth[];
};

export type FieldServiceMonthProps = {
  lang: string;
  month: FieldServiceMeetingTemplateMonth;
};

export type FieldServiceDayProps = {
  day: FieldServiceMeetingTemplateDay;
  isLast: boolean;
};
