import { OutgoingSpeakersScheduleType } from '@definition/schedules';

export type TemplateOutgoingSpeakersProps = {
  congregation: string;
  lang: string;
  data: OutgoingSpeakersScheduleType;
};

export type OSScheduleContainerProps = {
  data: OutgoingSpeakersScheduleType;
};

export type OSScheduleSpeakBoxProps = OSScheduleContainerProps & {
  last: boolean;
};

export type OSScheduleDateBoxProps = {
  formattedDate: string;
  last: boolean;
};

export type OSScheduleBrotherBoxProps = {
  speaker: { speaker: string; congregation: string };
};

export type OSScheduleTalkBoxProps = {
  talkAndSong: {
    song: { title: string; number: number };
    talk: { title: string; number: number };
  };
};
