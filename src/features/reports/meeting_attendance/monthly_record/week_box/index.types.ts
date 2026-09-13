import { MeetingType } from '@definition/app';

export type WeekBoxProps = {
  index: number;
  month: string;
  type: MeetingType;
  view?: string;
};

export type WeekBoxValues = {
  present: string;
  online: string;
  presentDeaf: string;
  onlineDeaf: string;
};

export type WeekBoxField = {
  name: keyof WeekBoxValues;
  label: string;
  section?: string;
};
