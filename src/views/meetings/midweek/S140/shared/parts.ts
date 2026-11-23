import { Week } from '@definition/week_type';
import { MidweekMeetingDataType } from '@definition/schedules';

export type S140Names = { primary?: string; secondary?: string };

export type S140Part = {
  id: string;
  time?: string;
  title?: string;
  duration?: string;
  names: S140Names;
  aux?: S140Names;
  dark?: boolean;
};

const studentNames = (
  meetingData: MidweekMeetingDataType,
  part: string,
  hall: 'A' | 'B'
): S140Names => ({
  primary: meetingData[`${part}_${hall}_student_name`],
  secondary: meetingData[`${part}_${hall}_assistant_name`],
});

export const treasuresParts = (
  meetingData: MidweekMeetingDataType,
  bibleReadingDuration: string
) => {
  const { timing } = meetingData;
  const parts: S140Part[] = [];

  if (meetingData.treasures) {
    parts.push(
      {
        id: 'tgw_talk',
        time: timing.tgw_talk,
        title: meetingData.tgw_talk_src,
        duration: meetingData.tgw_talk_time,
        names: { primary: meetingData.tgw_talk_name },
      },
      {
        id: 'tgw_gems',
        time: timing.tgw_gems,
        title: meetingData.tgw_gems_src,
        duration: meetingData.tgw_gems_time,
        names: { primary: meetingData.tgw_gems_name },
      }
    );
  }

  if (meetingData.students) {
    parts.push({
      id: 'tgw_bible_reading',
      time: timing.tgw_bible_reading,
      title: meetingData.tgw_bible_reading_src,
      duration: bibleReadingDuration,
      names: { primary: meetingData.tgw_bible_reading_A_name },
      aux: meetingData.aux_class
        ? { primary: meetingData.tgw_bible_reading_B_name }
        : undefined,
    });
  }

  return parts;
};

export const ministryParts = (meetingData: MidweekMeetingDataType) =>
  [1, 2, 3, 4]
    .filter((index) => meetingData[`ayf_part${index}_type`])
    .map((index): S140Part => {
      const part = `ayf_part${index}`;

      return {
        id: part,
        time: meetingData.timing[part],
        title: meetingData[`${part}_type_name`],
        duration: meetingData[`${part}_time`],
        names: studentNames(meetingData, part, 'A'),
        aux: meetingData.aux_class
          ? studentNames(meetingData, part, 'B')
          : undefined,
      };
    });

export const livingParts = (
  meetingData: MidweekMeetingDataType,
  concludingComments: string
) => {
  const { timing } = meetingData;

  const parts: S140Part[] = [1, 2, 3]
    .filter((index) => meetingData[`lc_part${index}_src`]?.length)
    .map((index) => ({
      id: `lc_part${index}`,
      time: timing[`lc_part${index}`],
      title: meetingData[`lc_part${index}_src`],
      duration: meetingData[`lc_part${index}_time`],
      names: { primary: meetingData[`lc_part${index}_name`] },
    }));

  // matches the app: concluding comments come before the CO talk
  if (meetingData.week_type === Week.CO_VISIT) {
    parts.push(
      {
        id: 'concluding_comments',
        time: timing.concluding_comments,
        title: concludingComments,
        names: { primary: meetingData.chairman_A_name },
        dark: true,
      },
      {
        id: 'co_talk',
        time: timing.co_talk,
        title: meetingData.lc_co_talk,
        names: { primary: meetingData.co_name },
      }
    );
  }

  if (meetingData.cbs) {
    parts.push({
      id: 'cbs',
      time: timing.cbs,
      title: meetingData.lc_cbs_title,
      duration: meetingData.lc_cbs_time,
      names: {
        primary: meetingData.lc_cbs_conductor_name,
        secondary: meetingData.lc_cbs_reader_name,
      },
    });
  }

  return parts;
};
