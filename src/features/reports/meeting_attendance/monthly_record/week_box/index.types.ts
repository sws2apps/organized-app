import { MeetingType } from '@definition/app';
import { AttendanceSaveParams } from '@definition/meeting_attendance';

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

export type WeekBoxDraft = {
  key: string;
  values: Partial<
    Record<
      keyof WeekBoxValues,
      {
        value: string;
        revision: number;
        status: 'pending' | 'saving' | 'saved' | 'failed';
      }
    >
  >;
};

export type AttendanceDraftsProps = {
  initialValues: WeekBoxValues;
  recordKey: string;
  disabled: boolean;
  params: Omit<AttendanceSaveParams, 'values'>;
};

export type AttendancePendingSave = {
  timer: ReturnType<typeof setTimeout>;
  save: () => Promise<void>;
};

export type WeekBoxField = {
  name: keyof WeekBoxValues;
  label: string;
  section?: string;
};
