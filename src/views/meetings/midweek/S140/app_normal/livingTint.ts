import { Week } from '@definition/week_type';
import { MidweekMeetingDataType } from '@definition/schedules';

const livingRows = (meetingData: MidweekMeetingDataType) => {
  const rows: string[] = [];

  if (meetingData.full) rows.push('middle_song');

  [1, 2, 3].forEach((index) => {
    if (meetingData[`lc_part${index}_src`]?.length)
      rows.push(`lc_part${index}`);
  });

  if (meetingData.week_type === Week.CO_VISIT) {
    rows.push('co_concluding', 'co_talk');
  }

  if (meetingData.cbs) {
    rows.push('cbs');
    if (meetingData.full) rows.push('concluding');
  }

  if (meetingData.full) rows.push('closing');

  return rows;
};

// every second row of the section is tinted, whichever rows the week has
const livingTint = (meetingData: MidweekMeetingDataType, row: string) =>
  livingRows(meetingData).indexOf(row) % 2 === 1 ? '#FFF3F1' : undefined;

export default livingTint;
