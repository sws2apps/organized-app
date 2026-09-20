import { ScheduleMeetingType } from '@definition/app';

export type SchedulePublishProps = {
  open: boolean;
  onClose: VoidFunction;
  type: ScheduleMeetingType;
};

export type YearGroupType = {
  year: string;
  months: string[];
};

export type ScheduleListType = {
  year: string;
  months: {
    month: string;
    checked: boolean;
    published: boolean;
  }[];
};
